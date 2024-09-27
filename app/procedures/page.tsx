const procedures = [
  {
    title: "How to Report Theft",
    description:
      "Step-by-step guide to reporting a theft, including necessary documentation.",
  },
  {
    title: "Filing a Police Clearance Certificate",
    description:
      "How to request a Police Clearance Certificate with a list of required documents.",
  },
  {
    title: "Reporting Assault",
    description:
      "Steps to follow when filing a report for molestation or assault cases.",
  },
];

export default function Procedures() {
  return (
    <div className="min-h-screen bg-slate-200 py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-8 text-black text-center">
          Police Procedures
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {procedures.map((procedure, index) => (
            <div key={index} className="bg-black p-6 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold mb-4">{procedure.title}</h3>
              <p>{procedure.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
