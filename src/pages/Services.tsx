
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Services = () => {
  const { data: siteSettings } = useQuery({
    queryKey: ['siteSettings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*');
      if (error) throw error;
      return data.reduce((acc, setting) => ({
        ...acc,
        [setting.key]: setting.value
      }), {});
    }
  });

  const serviceCategories = [
    {
      id: "cuts",
      title: "Cuts",
      services: [
        { name: "Ladies Cut", description: "Express shampoo, cut and express dry off", price: "from $85.00" },
        { name: "Ladies Maintenance Cut", description: "Full shampoo service, cut and full blow wave", price: "from $103.00" },
        { name: "Ladies Deluxe Creative Cut", description: "Full shampoo service, specialised cut and full blow wave", price: "from $116.00" },
        { name: "Ladies Restyle", description: "Full shampoo service, specialised cut creating significant change and full blow wave", price: "from $125.00" },
        { name: "Mens Maintenance Cut", description: "Express shampoo, cut and express dry off", price: "from $60.00" },
        { name: "Mens Restyle Cut", description: "Full shampoo service, specialised cut creating significant change and full blow wave", price: "from $85.00" },
        { name: "Beard Cut", description: "", price: "from $15.00" },
        { name: "Buzz Cut", description: "", price: "from $29.00" },
        { name: "Fringe Cut", description: "", price: "from $27.00" },
        { name: "Child Under 15 Years Full Service Cut", description: "Full shampoo service, cut and full blow wave", price: "from $85.00" },
        { name: "Child Under 15yrs Basic Cut", description: "Dry cut - on hair cleaned within past 48hrs", price: "from $53.00" }
      ]
    },
    {
      id: "colouring",
      title: "Colouring*",
      services: [
        { name: "Colour Hairline", description: "Part and hairline only", price: "from $51.00" },
        { name: "Colour Revamp", description: "Regrowth of no more than 6wks", price: "from $86.00" },
        { name: "Colour Scalp Lightening", description: "", price: "from $98.00" },
        { name: "All over Colour", description: "Permanent or Semi Colour", price: "from $100.00" },
        { name: "Micro Panel Foils", description: "Scattering of up to 10 foils", price: "from $62.00" },
        { name: "Half Head Foils", description: "Foils which focus on top, sides and hairline - providing a more natural look", price: "from $89.00" },
        { name: "Full Head Foils", description: "Foils which cover all over the head - providing a high impact of colour", price: "from $145.00" },
        { name: "Toning", description: "", price: "from $75.00" }
      ]
    },
    {
      id: "styling",
      title: "Styling*",
      services: [
        { name: "Unique Styling", description: "Tailored styling to suit your needs", price: "from $53.00" },
        { name: "Glamour Styling", description: "Ultimate straight or full-bodied curl blow dry", price: "from $102.00" },
        { name: "Signature Styling", description: "Specialised styling for formals and weddings", price: "from $147.00" }
      ]
    },
    {
      id: "specialist",
      title: "Specialist Services*",
      services: [
        { name: "Partial Crown Perm", description: "", price: "POA" },
        { name: "Perm", description: "", price: "POA" },
        { name: "Spiral Perm", description: "", price: "POA" }
      ]
    },
    {
      id: "treatments",
      title: "Treatments*",
      services: [
        { name: "Cleansing", description: "used to deeply cleanse the hair below a colour service", price: "from $25.00" },
        { name: "Damage Repair", description: "a specialised in-salon treatment to repair damage", price: "from $40.00" },
        { name: "Miracle", description: "a specialised in-salon keratin treatment", price: "from $40.00" },
        { name: "Moisturising", description: "adds intensive moisture to the hair", price: "from $25.00" },
        { name: "Specialised Treatment Bed", description: "a steaming bed offering a unique treatment to suit your hairs needs", price: "from $65.00" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="pt-16">
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h1 className="text-4xl font-bold text-gray-900 mb-8">Services</h1>
              
              <div className="text-left space-y-4 mb-12 text-gray-700">
                <p className="font-semibold">All prices apply to Sassy Hair Pearce and are a starting point...</p>
                
                <div>
                  <p className="font-semibold mb-2">Our services are based on the following length types:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li><strong>Short</strong> – above the jawline</li>
                    <li><strong>Medium</strong> – above the shoulders</li>
                    <li><strong>Long</strong> – above the shoulder blades</li>
                    <li><strong>Extra Long</strong> – below the shoulder blades</li>
                  </ul>
                </div>
                
                <p>Quotes cannot be given over the phone...</p>
                <p>All services can be quoted before the commencement...</p>
                <p>Stylists at The Sassy Collective set their own prices...</p>
              </div>
            </div>

            <Accordion type="multiple" className="w-full space-y-4">
              {serviceCategories.map((category) => (
                <AccordionItem key={category.id} value={category.id} className="border rounded-lg">
                  <AccordionTrigger className="px-6 py-4 text-left hover:no-underline">
                    <h2 className="text-xl font-semibold text-pink-600">{category.title}</h2>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    <div className="space-y-4">
                      {category.services.map((service, index) => (
                        <div key={index} className="flex justify-between items-start border-b border-gray-100 pb-3 last:border-b-0">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">{service.name}</h3>
                            {service.description && (
                              <p className="text-sm text-gray-600 mt-1">({service.description})</p>
                            )}
                          </div>
                          <div className="ml-4 text-right">
                            <span className="font-semibold text-pink-600">{service.price}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      </div>
      <Footer siteSettings={siteSettings} />
    </div>
  );
};

export default Services;
