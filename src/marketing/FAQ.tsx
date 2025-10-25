import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/ui/accordion';

export function FAQ() {
  const faqs = [
    {
      question: 'Does my data leave my browser or get stored on your servers?',
      answer: 'No. CleanCast runs entirely in your browser. Your files are processed locally and never uploaded to our servers. We have a zero data retention policy - your sensitive financial data stays with you.',
    },
    {
      question: 'What file formats can I import?',
      answer: 'CleanCast supports CSV and Excel (.xlsx, .xls) files. We can parse data from any accounting system, ERP, or spreadsheet that exports to these formats, including QuickBooks, NetSuite, SAP, and more.',
    },
    {
      question: 'Can I create custom templates for my bank or payment processor?',
      answer: 'Yes! While we provide pre-built templates for major banks and payment processors, you can easily create and save custom templates for your specific workflow. Just define the required and optional fields, and CleanCast will handle the mapping.',
    },
    {
      question: 'How does smart auto-mapping work?',
      answer: 'Our smart mapping algorithm analyzes your column headers and data patterns to suggest the best field matches automatically. It recognizes common naming variations (like "Email" vs "Email Address") and can match fields with 90%+ accuracy in most cases.',
    },
    {
      question: 'What happens if my data has validation errors?',
      answer: 'CleanCast validates your data in real-time and shows you exactly which rows have errors and why. You can filter to see only error rows, bulk edit data, or fix issues one at a time. Export is blocked until all required validation passes.',
    },
    {
      question: 'Can I save my mappings to reuse for future imports?',
      answer: 'Yes! You can save mapping profiles and reuse them for recurring imports. This is especially useful if you process the same type of file regularly - just load the profile and your field mappings are automatically applied.',
    },
    {
      question: 'Is this only for banking and payments?',
      answer: 'Not at all! While CleanCast was initially built for financial data transformation, it works for any data mapping and validation use case. Use it for HR data, logistics, e-commerce, CRM imports, or any scenario where you need to transform structured data.',
    },
    {
      question: 'What export formats do you support?',
      answer: 'Currently, CleanCast exports to CSV format, which is compatible with virtually all banking, payment, and business systems. We\'re working on adding JSON, XML, and other formats based on user feedback.',
    },
  ];

  return (
    <section id="faq" className="py-20 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-brand font-semibold text-slate-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to know about CleanCast
          </p>
        </div>

        {/* FAQ Accordion */}
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border border-gray-200 rounded-xl px-6 bg-white hover:shadow-md transition-shadow"
            >
              <AccordionTrigger className="text-left font-medium text-slate-900 hover:no-underline py-5">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 leading-relaxed pb-5">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

