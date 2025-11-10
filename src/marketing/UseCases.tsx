import { Building2, Users, Package, TrendingUp, Receipt, Database } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

export function UseCases() {
  const useCases = [
    {
      icon: Building2,
      category: 'BANKING & PAYMENTS',
      title: 'ACH & Wire Transfers',
      description: 'Import vendor lists from accounting systems and convert to NACHA, ISO20022, or proprietary bank formats.',
      badge: '1000+ records in 5 minutes',
      badgeColor: 'bg-emerald-100 text-emerald-800',
    },
    {
      icon: Users,
      category: 'PAYROLL SERVICES',
      title: 'Employee Payment Files',
      description: 'Transform HRIS exports into direct deposit files for any payroll provider or banking partner.',
      badge: 'Zero manual entry errors',
      badgeColor: 'bg-emerald-100 text-emerald-800',
    },
    {
      icon: Receipt,
      category: 'ACCOUNTS PAYABLE',
      title: 'Vendor Payment Batches',
      description: 'Standardize vendor data from NetSuite, SAP, or QuickBooks for payment processing platforms.',
      badge: '90% time savings',
      badgeColor: 'bg-emerald-100 text-emerald-800',
    },
    {
      icon: Package,
      category: 'PROCUREMENT',
      title: 'Supplier Onboarding',
      description: 'Bulk import supplier information and validate against required fields for compliance and onboarding.',
      badge: 'Scale from 10 to 10,000',
      badgeColor: 'bg-emerald-100 text-emerald-800',
    },
    {
      icon: TrendingUp,
      category: 'ACCOUNTING FIRMS',
      title: 'Multi-Client Management',
      description: 'Process client payment files with custom templates per client. Save and reuse mappings.',
      badge: 'Reusable templates',
      badgeColor: 'bg-emerald-100 text-emerald-800',
    },
    {
      icon: Database,
      category: 'DATA OPERATIONS',
      title: 'Format Standardization',
      description: 'Convert between any structured data formats - not just for payments. CSV to JSON, Excel to XML, and more.',
      badge: 'Unlimited flexibility',
      badgeColor: 'bg-emerald-100 text-emerald-800',
    },
  ];

  return (
    <section id="use-cases" className="py-20 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-brand font-medium text-slate-900 mb-4">
            More Than Just Banking
          </h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            Any team that moves data between systems can benefit from intelligent data transformation
          </p>
        </div>

        {/* Use Cases Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {useCases.map((useCase, index) => {
            const IconComponent = useCase.icon;
            return (
              <Card
                key={index}
                className="p-8 border border-gray-200 rounded-2xl bg-white hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <IconComponent className="w-6 h-6 text-blue-600" />
                  </div>
                  <Badge className={`${useCase.badgeColor} border-none text-xs px-3 py-1`}>
                    {useCase.badge}
                  </Badge>
                </div>
                
                <p className="text-xs font-semibold text-gray-500 tracking-wide mb-2">
                  {useCase.category}
                </p>
                
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  {useCase.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {useCase.description}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

