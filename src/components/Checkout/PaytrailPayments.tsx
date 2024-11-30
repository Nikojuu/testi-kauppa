"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import Subtitle from "../subtitle";

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
  }>;
  providers: PaytrailProvider[];
  customProviders: Record<string, unknown>;
};

function ProviderForm({ provider }: { provider: PaytrailProvider }) {
  return (
    <form method="POST" action={provider.url}>
      {provider.parameters.map((param) => (
        <input
          key={param.name}
          type="hidden"
          name={param.name}
          value={param.value}
        />
      ))}
      <button className="w-full h-full bg-white border border-gray-200 rounded-md p-4 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
        <Image
          src={provider.svg}
          alt={provider.name}
          width={100}
          height={50}
          className="mx-auto object-contain h-12"
        />
        <span className="mt-2 block text-sm text-gray-600">
          {provider.name}
        </span>
      </button>
    </form>
  );
}

function Group({
  group,
  providers,
  isExpanded,
  toggleGroup,
}: {
  group: { id: string; name: string; icon: string };
  providers: PaytrailProvider[];
  isExpanded: boolean;
  toggleGroup: () => void;
}) {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden transition-all duration-500 ease-in-out">
      <button
        onClick={toggleGroup}
        className="w-full flex items-center justify-between p-4 text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <div className="flex items-center">
          <Image
            src={group.icon}
            alt={group.name}
            width={24}
            height={24}
            className="mr-3"
          />
          <span className="text-lg font-medium text-gray-900">
            {group.name}
          </span>
        </div>
        <ChevronUp
          className={`h-5 w-5 text-gray-500 transform transition-transform duration-500 ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`transition-all duration-500 ease-in-out ${
          isExpanded ? "max-h-[3000px] " : "max-h-0 "
        }`}
        style={{ overflow: "hidden" }}
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4">
          {providers.map((provider) => (
            <ProviderForm key={provider.id} provider={provider} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function PaytrailCheckout({
  paytrailData,
}: {
  paytrailData: PaytrailResponse;
}) {
  const [expandedGroups, setExpandedGroups] = useState<string[]>([
    paytrailData.groups[0].id,
  ]);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) =>
      prev.includes(groupId)
        ? prev.filter((id) => id !== groupId)
        : [...prev, groupId]
    );
  };

  const groupedProviders = paytrailData.providers.reduce((acc, provider) => {
    if (!acc[provider.group]) {
      acc[provider.group] = [];
    }
    acc[provider.group].push(provider);
    return acc;
  }, {} as Record<string, PaytrailProvider[]>);

  if (!paytrailData) return null;

  return (
    <section className="mt-48">
      <Subtitle subtitle="Maksutavat" />
      <div className="mt-8 mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {paytrailData.groups.map((group) => (
            <Group
              key={group.id}
              group={group}
              providers={groupedProviders[group.id] || []}
              isExpanded={expandedGroups.includes(group.id)}
              toggleGroup={() => toggleGroup(group.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
