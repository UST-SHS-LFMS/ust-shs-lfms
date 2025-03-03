import React, { useState } from "react";
import StudentSidebar from "../../components/student/StudentSidebar";

const faqs = [
  {
    question: "How do I report a lost item?",
    answer:
      "You can report a lost item by filling out the form in the 'Lost Items' section.",
  },
  {
    question: "Where can I claim a found item?",
    answer:
      "Found items can be claimed at the Lost and Found Office located in the admin building.",
  },
  {
    question: "What should I do if I found an item?",
    answer:
      "Please submit the found item to the Lost and Found Office so it can be logged and returned to its owner.",
  },
];

const FAQAccordion = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <div
          key={index}
          className="border border-amber-300 rounded-lg overflow-hidden transition-shadow hover:shadow-md"
        >
          <button
            className={`w-full p-4 text-left font-medium text-lg flex justify-between items-center transition-colors ${
              openIndex === index
                ? "bg-amber-200 text-amber-900"
                : "bg-amber-100 text-amber-800 hover:bg-amber-150"
            }`}
            onClick={() => toggleFAQ(index)}
            aria-expanded={openIndex === index}
            aria-controls={`faq-answer-${index}`}
          >
            <span className="flex-1">{faq.question}</span>
            <span className="ml-4 w-6 h-6 flex items-center justify-center rounded-full bg-amber-300 text-amber-800 transition-transform duration-200 ease-in-out">
              <svg
                className={`w-4 h-4 transform transition-transform duration-200 ${
                  openIndex === index ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </span>
          </button>
          <div
            id={`faq-answer-${index}`}
            className={`transition-all duration-200 ease-in-out overflow-hidden ${
              openIndex === index ? "max-h-96" : "max-h-0"
            }`}
            role="region"
            aria-labelledby={`faq-question-${index}`}
          >
            <p className="p-4 text-gray-700 bg-white">{faq.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

function StudentHelp() {
  return (
    <div className="flex min-h-screen bg-amber-50/50">
      <StudentSidebar />
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-[#FFA500] mb-6">
          HELP & SUPPORT
        </h1>
        <FAQAccordion />
      </div>
    </div>
  );
}

export default StudentHelp;