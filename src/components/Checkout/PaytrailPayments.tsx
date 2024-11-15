import Image from "next/image";
import { useState } from "react";

export type PaytrailProvider = {
  url: string;
  icon: string;
  svg: string;
  name: string;
  group: string;
  id: string;
  parameters: { name: string; value: string }[];
};

export type PaytrailResponse = {
  transactionId: string;
  href: string;
  reference: string;
  terms: string;
  groups: Array<{
    id: string;
    name: string;
    icon: string;
    providers: string[];
  }>;
  providers: PaytrailProvider[];
  customProviders: Record<string, unknown>;
};
const PaytrailCheckout = ({
  paytrailData,
}: {
  paytrailData: PaytrailResponse;
}) => {
  return (
    <>
      {paytrailData && (
        <div className="mt-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Maksutavat</h2>
          {paytrailData.providers.map((provider, i) => (
            <form key={i} method="POST" action={provider.url} className="mb-2">
              {provider.parameters.map((param, i) => (
                <input
                  key={i}
                  type="hidden"
                  name={param.name}
                  value={param.value}
                />
              ))}
              <button className="w-full bg-white border border-gray-300 rounded-md p-2 hover:bg-gray-50 transition-colors">
                <Image
                  src={provider.svg}
                  alt={provider.name}
                  width={100}
                  height={50}
                  className="mx-auto"
                />
              </button>
            </form>
          ))}
        </div>
      )}
    </>
  );
};

export default PaytrailCheckout;
