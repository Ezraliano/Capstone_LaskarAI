

const DentalCariesPage = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Understanding Dental Caries</h2>
      
      <div className="mb-8">
        <img 
          src="/public/Dental_Carries.jpg"
          alt="Dental Caries"
          className="w-full h-64 object-cover rounded-lg mb-4"
        />
        <p className="text-gray-600 text-lg mb-6">
          Dental caries is a progressive disease that begins with microscopic damage to the tooth enamel and can eventually lead to visible cavities. The condition is caused by the interaction between bacteria in dental plaque, sugars from food, and the tooth's surface.
        </p>
      </div>

      <section className="mb-8">
        <h3 className="text-2xl font-semibold mb-4">Stages of Cavity Formation</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card p-6">
            <h4 className="font-semibold mb-2">Initial Demineralization</h4>
            <p className="text-gray-600">Appears as white spots on teeth, indicating the beginning of decay</p>
          </div>
          <div className="card p-6">
            <h4 className="font-semibold mb-2">Enamel Decay</h4>
            <p className="text-gray-600">Surface becomes soft and damaged as decay progresses</p>
          </div>
          <div className="card p-6">
            <h4 className="font-semibold mb-2">Dentin Decay</h4>
            <p className="text-gray-600">Damage reaches the layer beneath enamel, causing increased sensitivity</p>
          </div>
          <div className="card p-6">
            <h4 className="font-semibold mb-2">Pulp Involvement</h4>
            <p className="text-gray-600">Infection reaches the tooth's nerve center, often requiring root canal</p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h3 className="text-2xl font-semibold mb-4">Prevention Tips</h3>
        <ul className="space-y-3">
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
            <span>Brush teeth twice daily with fluoride toothpaste</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
            <span>Floss daily to remove plaque between teeth</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
            <span>Limit sugary and acidic foods</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
            <span>Visit your dentist regularly for checkups</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
            <span>Consider dental sealants for cavity prevention</span>
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h3 className="text-2xl font-semibold mb-4">Educational Video</h3>
        <div className="aspect-w-16 aspect-h-9">
          <iframe 
            className="w-full rounded-lg"
            height="415"
            src="https://www.youtube.com/embed/zGoBFU1q4g0?si=8zEDrWkOQWDtFB3S" 
            title="Understanding Dental Caries"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </section>
    </div>
  );
};

export default DentalCariesPage;