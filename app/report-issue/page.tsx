export default function ReportIssue() {
  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-8 text-center">
          Report an Issue Anonymously
        </h2>
        <form className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <label
              className="block text-gray-700 font-semibold mb-2"
              htmlFor="code"
            >
              Enter Predefined Code
            </label>
            <input
              id="code"
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="Enter your predefined tip code"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 font-semibold mb-2"
              htmlFor="message"
            >
              Additional Information (Optional)
            </label>
            <textarea
              id="message"
              className="w-full p-3 border border-gray-300 rounded-lg"
              rows={4}
              placeholder="Add any additional details if necessary..."
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600"
          >
            Submit Tip
          </button>
        </form>
      </div>
    </div>
  );
}
