export default function ShippingPage() {
    return (
        <div className="container py-16">
            <div className="max-w-4xl mx-auto">
                <h1 className="font-serif text-4xl font-bold mb-6">Shipping & Returns</h1>

                <div className="prose prose-lg max-w-none space-y-8">
                    <section>
                        <h2 className="font-serif text-2xl font-semibold">Shipping Information</h2>
                        <p>We currently ship within Pakistan only. International shipping coming soon!</p>

                        <h3 className="font-semibold mt-4">Delivery Times</h3>
                        <ul>
                            <li>Lahore: 1-2 business days</li>
                            <li>Major Cities: 2-3 business days</li>
                            <li>Other Areas: 3-5 business days</li>
                        </ul>

                        <h3 className="font-semibold mt-4">Shipping Costs</h3>
                        <ul>
                            <li>Orders over PKR 5,000: FREE shipping</li>
                            <li>Orders under PKR 5,000: PKR 200</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="font-serif text-2xl font-semibold">Returns Policy</h2>
                        <p>We want you to love your fragrance! If you're not completely satisfied:</p>
                        <ul>
                            <li>Returns accepted within 14 days of delivery</li>
                            <li>Products must be unopened and in original packaging</li>
                            <li>Refund processed within 7-10 business days</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="font-serif text-2xl font-semibold">Exchange Policy</h2>
                        <p>Exchanges are available for:</p>
                        <ul>
                            <li>Damaged or defective products</li>
                            <li>Wrong item received</li>
                            <li>Size/variant exchanges (unopened only)</li>
                        </ul>
                    </section>
                </div>
            </div>
        </div>
    );
}
