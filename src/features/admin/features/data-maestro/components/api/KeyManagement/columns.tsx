
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { KeyRound, AlertTriangle } from "lucide-react";
import { APIKeyActions } from "./APIKeyActions";

interface APIKey {
  id: string;
  name: string;
  key_type: string;
  created_at: string;
  expires_at: string | null;
  is_active: boolean;
  last_used_at: string | null;
}

export const columns: ColumnDef<APIKey>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const isExpired = row.original.expires_at && new Date(row.original.expires_at) < new Date();
      return (
        <div className="flex items-center space-x-2">
          <KeyRound className="w-4 h-4 text-primary" />
          <span>{row.original.name}</span>
          {isExpired && (
            <Badge variant="destructive" className="ml-2">
              <AlertTriangle className="w-3 h-3 mr-1" />
              Expired
            </Badge>
          )}
        </div>
      );
    }
  },
  {
    accessorKey: "key_type",
    header: "Type",
    cell: ({ row }) => (
      <Badge variant="secondary" className="capitalize">
        {row.original.key_type}
      </Badge>
    )
  },
  {
    accessorKey: "created_at",
    header: "Created",
    cell: ({ row }) => format(new Date(row.original.created_at), 'MMM d, yyyy')
  },
  {
    accessorKey: "last_used_at",
    header: "Last Used",
    cell: ({ row }) => {
      const lastUsed = row.original.last_used_at;
      return lastUsed ? format(new Date(lastUsed), 'MMM d, yyyy HH:mm') : 'Never';
    }
  },
  {
    accessorKey: "is_active",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={row.original.is_active ? "success" : "secondary"}>
        {row.original.is_active ? "Active" : "Inactive"}
      </Badge>
    )
  },
  {
    id: "actions",
    cell: ({ row }) => <APIKeyActions key={row.original.id} apiKey={row.original} />
  }
];
