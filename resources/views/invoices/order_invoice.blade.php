<!DOCTYPE html>
<html>
<head>
    <title>Invoice #{{ $order->id }}</title>
    <style>
        body {
            font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
            text-align: center;
            color: #777;
        }

        body h1 {
            font-weight: 300;
            margin-bottom: 0px;
            padding-bottom: 0px;
            color: #000;
        }

        body h3 {
            font-weight: 300;
            margin-top: 10px;
            margin-bottom: 20px;
            font-style: italic;
            color: #555;
        }

        body a {
            color: #06f;
        }

        .invoice-box {
            max-width: 800px;
            margin: auto;
            padding: 30px;
            border: 1px solid #eee;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
            font-size: 16px;
            line-height: 24px;
            color: #555;
        }

        .invoice-box table {
            width: 100%;
            line-height: inherit;
            text-align: left;
            border-collapse: collapse;
        }

        .invoice-box table td {
            padding: 5px;
            vertical-align: top;
        }

        .invoice-box table tr td:nth-child(2) {
            text-align: right;
        }

        .invoice-box table tr.top table td {
            padding-bottom: 20px;
        }

        .invoice-box table tr.top table td.title {
            font-size: 45px;
            line-height: 45px;
            color: #333;
        }

        .invoice-box table tr.information table td {
            padding-bottom: 40px;
        }

        .invoice-box table tr.heading td {
            background: #eee;
            border-bottom: 1px solid #ddd;
            font-weight: bold;
        }

        .invoice-box table tr.details td {
            padding-bottom: 20px;
        }

        .invoice-box table tr.item td {
            border-bottom: 1px solid #eee;
        }

        .invoice-box table tr.item.last td {
            border-bottom: none;
        }

        .invoice-box table tr.total td:nth-child(2) {
            border-top: 2px solid #eee;
            font-weight: bold;
        }

        @media only screen and (max-width: 600px) {
            .invoice-box table tr.top table td,
            .invoice-box table tr.information table td {
                display: block;
                width: 100%;
                text-align: center;
            }
        }
    </style>
</head>
<body>
    <div class="invoice-box">
        <table>
            <tr class="top">
                <td colspan="2">
                    <table>
                        <tr>
                            <td class="title">
                                <img src="data:image/png;base64,{{ base64_encode(file_get_contents(public_path('logo.png'))) }}" style="width: 100%; max-width: 150px" />
                            </td>

                            <td>
                                Invoice #: {{ $order->id }}<br />
                                Created: {{ $order->created_at->format('M d, Y') }}<br />
                                Due: {{ $order->created_at->addDays(7)->format('M d, Y') }} {{-- Example: Due in 7 days --}}
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>

            <tr class="information">
                <td colspan="2">
                    <table>
                        <tr>
                            <td>
                                EnvoEarth, Inc.<br />
                                123 Main Street<br />
                                City, State 12345
                            </td>

                            <td>
                                {{ $order->user->name }}<br />
                                {{ $order->user->email }}<br />
                                {{ $order->address }}
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>

            <tr class="heading">
                <td>Payment Method</td>
                <td>Check #</td>
            </tr>

            <tr class="details">
                <td>Stripe</td> {{-- Assuming Stripe for now --}}
                <td>1000</td> {{-- Example --}}
            </tr>

            <tr class="heading">
                <td>Item</td>
                <td>Price</td>
            </tr>

            @foreach ($order->order_items as $item)
                <tr class="item">
                    <td>{{ $item->product->name }} (x{{ $item->quantity }})</td>
                    <td>{{ number_format($item->price * $item->quantity, 2) }}</td>
                </tr>
            @endforeach

            <tr class="total">
                <td></td>
                <td>Total: {{ number_format($order->total_amount, 2) }}</td>
            </tr>
        </table>
    </div>
</body>
</html>
