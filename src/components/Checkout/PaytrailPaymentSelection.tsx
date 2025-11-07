import { PaytrailResponse } from "@/app/utils/paytrailTypes";
import React from "react";
import Image from "next/image";

const PaymentSelection = ({
  paytrailData,
}: {
  paytrailData: PaytrailResponse;
}) => {
  const { groups, providers } = paytrailData;

  if (!groups || !providers) {
    return <div>Loading payment methods...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Valitse maksutapa
      </h1>
      {groups.map((group) => (
        <div
          key={group.id}
          className="mb-8 border border-gray-200 rounded-lg p-4"
        >
          <h2 className="flex items-center gap-3 text-xl font-semibold text-gray-700 mb-4">
            <Image
              src={group.icon}
              alt=""
              width={32}
              height={32}
              className="w-8 h-8"
            />
            {group.name}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {providers
              .filter((provider) => provider.group === group.id)
              .map((provider) => (
                <form
                  key={`${provider.id}-${provider.name}`}
                  method="POST"
                  action={provider.url}
                  className="w-full"
                >
                  {provider.parameters.map((param) => (
                    <input
                      key={param.name}
                      type="hidden"
                      name={param.name}
                      value={param.value}
                    />
                  ))}
                  <button
                    type="submit"
                    className="w-full p-3 border border-gray-300 rounded-lg hover:border-primary hover:shadow-md transition-all duration-200 bg-white flex items-center justify-center"
                  >
                    <Image
                      src={provider.svg}
                      alt={provider.name}
                      width={100}
                      height={40}
                      className="max-w-full h-auto object-contain"
                    />
                  </button>
                </form>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PaymentSelection;
