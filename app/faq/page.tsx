import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQPage() {
    const faqs = [
        {
            question: "How do I choose the right fragrance?",
            answer: "Take our Scent Quiz to get personalized recommendations based on your preferences. You can also order sample sets to try fragrances before committing to a full bottle."
        },
        {
            question: "What is the difference between Eau de Parfum and Eau de Toilette?",
            answer: "Eau de Parfum (EDP) has a higher concentration of fragrance oils (15-20%) and lasts longer. Eau de Toilette (EDT) has a lighter concentration (5-15%) and is perfect for daily wear."
        },
        {
            question: "How should I store my fragrances?",
            answer: "Store fragrances in a cool, dry place away from direct sunlight. Keep bottles tightly closed when not in use to preserve the scent."
        },
        {
            question: "Do you offer international shipping?",
            answer: "Currently, we ship within Pakistan. International shipping will be available soon. Subscribe to our newsletter for updates."
        },
        {
            question: "What is your return policy?",
            answer: "We accept returns within 14 days of delivery for unopened products. Please see our Shipping & Returns page for full details."
        },
        {
            question: "Are your fragrances authentic?",
            answer: "Yes, all RUHEA fragrances are 100% authentic and crafted with premium ingredients. Each bottle comes with a certificate of authenticity."
        },
    ];

    return (
        <div className="container py-16">
            <div className="max-w-3xl mx-auto">
                <h1 className="font-serif text-4xl font-bold mb-4 text-center">
                    Frequently Asked Questions
                </h1>
                <p className="text-lg text-muted-foreground mb-12 text-center">
                    Find answers to common questions about our fragrances and services.
                </p>

                <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                            <AccordionTrigger className="text-left">
                                {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </div>
    );
}
