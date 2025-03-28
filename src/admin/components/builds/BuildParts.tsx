
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Package } from "lucide-react";
import { BuildPart } from "@/admin/types/build.types";

interface BuildPartsProps {
  parts: BuildPart[];
}

export function BuildParts({ parts }: BuildPartsProps) {
  if (!parts || parts.length === 0) {
    return (
      <div className="rounded-md bg-muted/50 p-8 flex flex-col items-center justify-center gap-2">
        <Package className="w-8 h-8 text-muted-foreground" />
        <p className="text-muted-foreground">No parts in this build</p>
      </div>
    );
  }
  
  return (
    <div>
      <h3 className="font-medium mb-2">Parts List</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Part Name</TableHead>
            <TableHead className="text-right">Quantity</TableHead>
            <TableHead>Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {parts.map((part) => (
            <TableRow key={part.id}>
              <TableCell className="font-medium">{part.name}</TableCell>
              <TableCell className="text-right">{part.quantity}</TableCell>
              <TableCell className="text-muted-foreground">
                {part.notes || "No notes"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
