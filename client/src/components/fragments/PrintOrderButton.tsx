"use client";

import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";
import { Receipt } from "./Receipt";
import { Printer } from "lucide-react"; 

interface PrintOrderButtonProps {
  order: any;
}

export default function PrintOrderButton({ order }: PrintOrderButtonProps) {
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef, 
    documentTitle: `Struk-Order-${order.id}`,
  });

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        className="mr-2 border-gray-400 text-gray-700 hover:bg-gray-100"
        onClick={() => handlePrint()}
        title="Cetak Struk"
      >
        <Printer className="w-4 h-4 mr-1" /> Cetak
      </Button>
      <div style={{ display: "none" }}>
        <Receipt ref={componentRef} order={order} />
      </div>
    </>
  );
}