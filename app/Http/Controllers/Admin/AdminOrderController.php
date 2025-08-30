<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Dompdf\Dompdf;
use Dompdf\Options;

class AdminOrderController extends Controller
{
    public function index(Request $request)
    {
        $query = Order::with(['user']);

        // Search functionality
        if ($request->filled('search')) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%')
                  ->orWhere('id', 'like', '%' . $request->search . '%');
            });
        }

        // Status filter
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $orders = $query->latest()->paginate(15)->withQueryString();

        // Get unique statuses for filter
        $statuses = Order::distinct()->pluck('status')->filter();

        return Inertia::render('Admin/Orders/Index', [
            'orders' => $orders,
            'statuses' => $statuses,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function show(Order $order)
    {
        $order->load(['user', 'order_items.product']);

        return Inertia::render('Admin/Orders/Show', [
            'order' => $order,
        ]);
    }

    public function updateStatus(Request $request, Order $order)
    {
        $request->validate([
            'status' => 'required|in:pending,processing,shipped,delivered,cancelled',
        ]);

        $order->update([
            'status' => $request->status,
        ]);

        return redirect()->back()->with('success', 'Order status updated successfully.');
    }

    public function destroy(Order $order)
    {
        $order->delete();

        return redirect()->route('admin.orders.index')
            ->with('success', 'Order deleted successfully.');
    }

    public function generateInvoice(Order $order)
    {
        $order->load(['user', 'order_items.product']);

        $data = [
            'order' => $order,
        ];

        $options = new Options();
        $options->set('isHtml5ParserEnabled', true);
        $options->set('isRemoteEnabled', true);

        $dompdf = new Dompdf($options);
        $html = view('invoices.order_invoice', $data)->render();
        $dompdf->loadHtml($html);
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();

        return response()->stream(
            function () use ($dompdf) {
                echo $dompdf->output();
            },
            200,
            [
                "Content-Type" => "application/pdf",
                "Content-Disposition" => "inline; filename=\"invoice_" . $order->id . ".pdf\"",
            ]
        );
    }

    public function downloadInvoice(Order $order)
    {
        // Generate and return PDF invoice
        $pdf = PDF::loadView('admin.invoices.template', compact('order'));
        return $pdf->download('invoice-' . $order->id . '.pdf');
    }
}
