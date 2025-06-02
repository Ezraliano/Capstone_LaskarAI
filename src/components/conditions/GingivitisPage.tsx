
const GingivitisPage = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Understanding Gingivitis</h2>
      
      <div className="mb-8">
        <img 
          src="https://images.pexels.com/photos/4269693/pexels-photo-4269693.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="Gingivitis"
          className="w-full h-64 object-cover rounded-lg mb-4"
        />
        <p className="text-gray-600 text-lg mb-6">
          Gingivitis is a common and mild form of gum disease that causes irritation, redness, and inflammation of the gingiva, the part of your gum around the base of your teeth. Early detection and treatment can prevent its progression to more serious periodontal disease.
        </p>
      </div>

      <section className="mb-8">
        <h3 className="text-2xl font-semibold mb-4">Common Signs and Symptoms</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card p-6">
            <h4 className="font-semibold mb-2">Swollen or Puffy Gums</h4>
            <p className="text-gray-600">Gums appear red and inflamed, may be tender to touch</p>
          </div>
          <div className="card p-6">
            <h4 className="font-semibold mb-2">Bleeding Gums</h4>
            <p className="text-gray-600">Bleeding during brushing or flossing is a common sign</p>
          </div>
          <div className="card p-6">
            <h4 className="font-semibold mb-2">Bad Breath</h4>
            <p className="text-gray-600">Persistent bad breath or bad taste in the mouth</p>
          </div>
          <div className="card p-6">
            <h4 className="font-semibold mb-2">Receding Gums</h4>
            <p className="text-gray-600">Gums pulling away from teeth, making teeth appear longer</p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h3 className="text-2xl font-semibold mb-4">Prevention and Treatment</h3>
        <div className="grid grid-cols-1 gap-4">
          <div className="card p-6">
            <h4 className="font-semibold mb-3">Daily Oral Care</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                <span>Brush teeth properly at least twice daily</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                <span>Use dental floss daily</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                <span>Use an antiseptic mouthwash</span>
              </li>
            </ul>
          </div>
          <div className="card p-6">
            <h4 className="font-semibold mb-3">Professional Treatment</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                <span>Regular dental checkups and cleanings</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                <span>Professional scaling and root planing if needed</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                <span>Follow-up visits to monitor improvement</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h3 className="text-2xl font-semibold mb-4">Educational Video</h3>
        <div className="aspect-w-16 aspect-h-9">
          <iframe 
            className="w-full rounded-lg"
            height="415"
            src="https://www.youtube.com/embed/FViqyY8h4wE?si=lFek0e9ArvGAnire" 
            title="Understanding Gingivitis"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </section>
    </div>
  );
};

export default GingivitisPage;