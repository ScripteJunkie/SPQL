import { useState, useEffect } from 'react';
import { media } from 'styles/media';

import { InputSwitch } from 'primereact/inputswitch';
import { Card } from 'primereact/card';

import { Button } from 'primereact/button';
import styled from 'styled-components';

function PricingCard({
  title,
  description,
  price,
  features,
  buttonLabel,
  buttonStyle,
  pricingType,
}) {
  return (
    <div className="col-12 lg:col-4" id="pricing">
      <div className="p-3 h-full">
        <div
          className="shadow-2 p-3 h-full flex flex-column surface-card"
          style={{ borderRadius: '12px' }}
        >
          <div className="text-900 font-medium text-xl mb-2">{title}</div>
          <div className="text-600">{description}</div>
          <hr className="my-3 mx-0 border-top-1 border-none surface-border" />
          {pricingType === 'monthly' && (
            <div className="flex align-items-center">
              <span className="font-bold text-2xl text-900">${price}</span>
              <span className="ml-2 font-medium text-600">per month</span>
            </div>
          )}
          {pricingType === 'yearly' && (
            <div className="flex align-items-center">
              <span className="font-bold text-2xl text-900">
                ${Math.round(+price * 9.6)}
              </span>
              <span className="ml-2 font-medium text-600">per year</span>
            </div>
          )}
          {pricingType === 'custom' && (
            <div className="flex align-items-center">
              <span className="font-bold text-2xl text-900">{price}</span>
            </div>
          )}
          <hr className="my-3 mx-0 border-top-1 border-none surface-border" />
          <ul className="list-none p-0 m-0 flex-grow-1">
            {features.map((feature, index) => (
              <li key={index} className="flex align-items-center mb-2">
                <span className="mr-2">
                  <i className="pi pi-check-circle text-600"></i>
                </span>
                <span className="text-600">{feature}</span>
              </li>
            ))}
          </ul>
          <hr className="my-3 mx-0 border-top-1 border-none surface-border" />
          {buttonStyle === 'filled' && (
            <button
              aria-label="Buy Now"
              className="p-button p-component p-3 w-full mt-auto"
              style={{ borderRadius: '12px' }}
              onClick={() => {
                window.location.href = '/signup';
              }}
            >
              <span className="p-button-label p-c">{buttonLabel}</span>
              <span
                role="presentation"
                className="p-ink"
                style={{ height: '232.328px', width: '232.328px' }}
              />
            </button>
          )}
          {buttonStyle === 'outlined' && (
            <button
              aria-label="Buy Now"
              className="p-button p-component p-3 w-full mt-auto p-button-outlined"
              style={{ borderRadius: '12px' }}
              onClick={() => {
                window.location.href = '/signup';
              }}
            >
              <span className="p-button-label p-c">{buttonLabel}</span>
              <span
                role="presentation"
                className="p-ink"
                style={{ height: '232.328px', width: '232.328px' }}
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const ContactUs = styled.div`
  display: inline-block;
  border-radius: 6px;
  ${media.large} {
    max-width: 50rem;
  }
`;

export function Pricing() {
  const [checked, setChecked] = useState(false);
  const [pricingType, setPricingType] = useState('monthly');

  useEffect(() => {
    if (checked) {
      setPricingType('yearly');
    } else {
      setPricingType('monthly');
    }
  }, [checked]);

  return (
    <>
      <div
        id="pricing"
        style={{
          background: '#fff',
          width: '100%',
          maxWidth: '90rem',
          padding: '0 auto',
          overflowX: 'hidden',
        }}
        className="container mx-auto"
      >
        <div className="surface-ground">
          <div className="text-900 font-bold text-6xl mb-4 text-center">
            Pricing that Packs a Punch
          </div>
          <div className="text-700 text-xl mb-6 text-center px-2">
            Accounts for both your analysts and the everyday user, whether
            they're marketing, sales, or support.
          </div>
          <div className="flex align-items-center justify-content-center text-900 my-3">
            <span className="font-semibold mr-3">Monthly</span>
            <div
              className="p-inputswitch p-component"
              role="checkbox"
              aria-checked="false"
            >
              <div className="p-hidden-accessible">
                <input type="checkbox" role="switch" aria-checked="false" />
              </div>
              <InputSwitch
                checked={checked}
                onChange={(e: any) => {
                  setChecked(e.value);
                  console.log(e.value);
                }}
              />
            </div>
            <span className="ml-3">Yearly</span>
          </div>
          <div className="grid">
            <PricingCard
              title="Team"
              description="For the small team that wants to get started with analytics"
              price="149"
              features={[
                '5 Accounts',
                '20 Dashboards',
                '10GB Storage',
                '2 Data Sources',
                'Basic Analytics Features',
              ]}
              buttonLabel="Buy Now"
              buttonStyle="filled"
              pricingType={pricingType}
            />
            <PricingCard
              title="Business"
              description="For the growing business that wants to scale analytics"
              price="999"
              features={[
                '25 Accounts',
                'Unlimited Dashboards',
                '100GB Storage',
                'Up to 10 Data Sources',
                'Advanced Analytics Features',
                'Email Support',
              ]}
              buttonLabel="Buy Now"
              buttonStyle="filled"
              pricingType={pricingType}
            />
            <PricingCard
              title="Beyond"
              description="For the enterprise that wants to go beyond analytics"
              price="Custom"
              features={[
                'Custom Accounts',
                'Custom Dashboards',
                'Custom Storage',
                'Custom Data Sources',
                'Custom Analytics Features',
                'Email/Phone Support',
              ]}
              buttonLabel="Contact Us"
              buttonStyle="outlined"
              pricingType="custom"
            />
          </div>
        </div>
      </div>
    </>
  );
}
