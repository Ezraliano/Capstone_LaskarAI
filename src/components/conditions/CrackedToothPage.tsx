

const CrackedToothPage = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Understanding Cracked Teeth</h2>
      
      <div className="mb-8">
        <img 
          src="/public/Cracked_Tooth.jpg"
          alt="Cracked Tooth"
          className="w-full h-64 object-cover rounded-lg mb-4"
        />
        <p className="text-gray-600 text-lg mb-6">
          A cracked tooth can range from a minor hairline fracture to a severe split in the tooth structure. Understanding the type and extent of the crack is crucial for proper treatment and preventing further damage.
        </p>
      </div>

      <section className="mb-8">
        <h3 className="text-2xl font-semibold mb-4">Types of Tooth Cracks</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card p-6">
            <h4 className="font-semibold mb-2">Craze Lines</h4>
            <p className="text-gray-600">Superficial cracks affecting only the enamel, usually harmless</p>
          </div>
          <div className="card p-6">
            <h4 className="font-semibold mb-2">Fractured Cusp</h4>
            <p className="text-gray-600">Damage to the pointed chewing surface of the tooth</p>
          </div>
          <div className="card p-6">
            <h4 className="font-semibold mb-2">Split Tooth</h4>
            <p className="text-gray-600">Complete separation of tooth segments, often requires extraction</p>
          </div>
          <div className="card p-6">
            <h4 className="font-semibold mb-2">Vertical Root Fracture</h4>
            <p className="text-gray-600">Crack begins in the root and extends upward</p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h3 className="text-2xl font-semibold mb-4">Risk Factors</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card p-4">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
              Large existing fillings
            </span>
          </div>
          <div className="card p-4">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
              Teeth grinding (bruxism)
            </span>
          </div>
          <div className="card p-4">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
              Trauma or injury
            </span>
          </div>
          <div className="card p-4">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
              Age (more common in older adults)
            </span>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h3 className="text-2xl font-semibold mb-4">Educational Video</h3>
        <div className="aspect-w-16 aspect-h-9">
          <iframe 
            className="w-full rounded-lg"
            height="415"
            src="https://www.youtube.com/embed/UdL2pKeKvmk?si=mTdCUU9tHdy48Kw8" 
            title="Understanding Cracked Teeth"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </section>
    </div>
  );
};

export default CrackedToothPage;