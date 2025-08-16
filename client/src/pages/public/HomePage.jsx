import { Link } from 'react-router-dom';
import { 
  TruckIcon, 
  ShieldCheckIcon, 
  CurrencyDollarIcon,
  MapPinIcon,
  UsersIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline';

const features = [
  {
    name: 'Direct from Farmers',
    description: 'Buy fresh produce directly from local farmers, cutting out middlemen for better prices.',
    icon: UsersIcon,
  },
  {
    name: 'Local Delivery',
    description: 'Get fresh produce delivered to your doorstep or arrange convenient pickup locations.',
    icon: TruckIcon,
  },
  {
    name: 'Secure Payments',
    description: 'Pay safely with M-Pesa or card payments. Your transactions are protected and secure.',
    icon: ShieldCheckIcon,
  },
  {
    name: 'Fair Pricing',
    description: 'Farmers get better prices for their produce while you save on fresh, quality products.',
    icon: CurrencyDollarIcon,
  },
  {
    name: 'Location-Based',
    description: 'Find farmers and produce near you using our smart location-based search.',
    icon: MapPinIcon,
  },
  {
    name: 'Quality Assured',
    description: 'All listings include harvest dates and farmer profiles to ensure quality and freshness.',
    icon: ShoppingBagIcon,
  },
];

const categories = [
  {
    name: 'Fruits',
    image: 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=400',
    listings: '150+ listings'
  },
  {
    name: 'Vegetables',
    image: 'https://images.pexels.com/photos/1300972/pexels-photo-1300972.jpeg?auto=compress&cs=tinysrgb&w=400',
    listings: '200+ listings'
  },
  {
    name: 'Grains',
    image: 'https://images.pexels.com/photos/236014/pexels-photo-236014.jpeg?auto=compress&cs=tinysrgb&w=400',
    listings: '80+ listings'
  },
  {
    name: 'Dairy',
    image: 'https://images.pexels.com/photos/416430/pexels-photo-416430.jpeg?auto=compress&cs=tinysrgb&w=400',
    listings: '45+ listings'
  },
];

export default function HomePage() {
  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary-400 to-secondary-400 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
        
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Fresh from Farm to Your Table
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Connect directly with local farmers across Kenya. Buy fresh, quality produce at fair prices 
              while supporting smallholder farming communities.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link to="/browse" className="btn-primary">
                Browse Products
              </Link>
              <Link to="/register" className="btn-outline">
                Join as Farmer
              </Link>
            </div>
          </div>
        </div>
        
        <div
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-primary-400 to-secondary-400 opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
      </div>

      {/* Categories section */}
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-primary-600">Fresh Categories</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Discover Local Produce
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              From fresh fruits and vegetables to grains and dairy products, find quality produce from farmers in your area.
            </p>
          </div>
          
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  to={`/browse?category=${category.name.toLowerCase()}`}
                  className="group relative overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <div className="aspect-h-3 aspect-w-4 overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-500">{category.listings}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features section */}
      <div className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-primary-600">Why Choose FarmDirect</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Connecting Communities Through Fresh Food
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              We're building a sustainable food system that benefits both farmers and consumers while strengthening local communities.
            </p>
          </div>
          
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.name} className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                    <feature.icon className="h-5 w-5 flex-none text-primary-600" aria-hidden="true" />
                    {feature.name}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-primary-600">
        <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to get started?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-primary-100">
              Join thousands of Kenyans who are already buying fresh produce directly from farmers. 
              Start shopping today or register to sell your farm produce.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                to="/register"
                className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-primary-600 shadow-sm hover:bg-primary-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Get started
              </Link>
              <Link to="/browse" className="text-sm font-semibold leading-6 text-white">
                Browse products <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}