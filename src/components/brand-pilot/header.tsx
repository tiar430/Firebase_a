"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileDown,
  FileUp,
  PlusCircle,
  Search,
} from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import type { Brand } from "@/lib/types";

interface HeaderProps {
  brandFilter: string;
  setBrandFilter: (brand: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onAddNew: () => void;
  onExport: () => void;
  onImport: (file: File) => void;
  brands: Brand[];
}

export function Header({
  brandFilter,
  setBrandFilter,
  searchQuery,
  setSearchQuery,
  onAddNew,
  onExport,
  onImport,
  brands,
}: HeaderProps) {
  const importFileRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    importFileRef.current?.click();
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImport(file);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
       <SidebarTrigger className="md:hidden" />
      
      <div className="relative ml-auto flex-1 md:grow-0">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search programs..."
          className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Select value={brandFilter} onValueChange={setBrandFilter}>
        <SelectTrigger className="w-[180px] hidden md:flex">
          <SelectValue placeholder="Filter by brand" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">All Brands</SelectItem>
          {brands.map((brand) => (
            <SelectItem key={brand} value={brand}>
              {brand}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="hidden md:flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onExport}>
          <FileDown className="mr-2 h-4 w-4" />
          Export
        </Button>
        <Button variant="outline" size="sm" onClick={handleImportClick}>
          <FileUp className="mr-2 h-4 w-4" />
          Import
        </Button>
        <input type="file" ref={importFileRef} className="hidden" accept=".csv" onChange={handleFileChange} />
      </div>

      <Button size="sm" className="gap-1" onClick={onAddNew}>
        <PlusCircle className="h-4 w-4" />
        <span className="hidden sm:inline">Add Program</span>
      </Button>
      
    </header>
  );
}
