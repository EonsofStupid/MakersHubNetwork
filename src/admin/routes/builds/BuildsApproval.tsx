
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { DataTable } from "@/components/ui/data-table";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MoreHorizontal, CheckCircle, XCircle, EyeIcon, Clock } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { ColumnDef } from "@tanstack/react-table";
import type { PrinterBuild } from "@/types/database";

type BuildStatus = "pending" | "approved" | "rejected";

interface BuildWithUserData extends PrinterBuild {
  user_name: string;
}

export default function BuildsApproval() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<BuildStatus>("pending");
  
  // Fetch builds data based on active tab
  const { data: builds, isLoading, refetch } = useQuery({
    queryKey: ["admin-builds", activeTab],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("printer_builds")
        .select(`
          id, 
          title, 
          description, 
          submitted_by, 
          status, 
          created_at, 
          updated_at,
          processed_at,
          images,
          parts_count,
          mods_count,
          complexity_score,
          profiles(display_name)
        `)
        .eq("status", activeTab)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching builds:", error);
        toast({
          title: "Error fetching builds",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }

      return data.map(build => ({
        ...build,
        user_name: build.profiles?.display_name || "Unknown user",
      })) as BuildWithUserData[];
    },
  });

  // Handle approval/rejection of builds
  const updateBuildStatus = async (buildId: string, newStatus: BuildStatus) => {
    try {
      const { error } = await supabase
        .from("printer_builds")
        .update({ status: newStatus, processed_at: new Date().toISOString() })
        .eq("id", buildId);

      if (error) throw error;

      toast({
        title: `Build ${newStatus}`,
        description: `The build has been ${newStatus} successfully`,
        variant: newStatus === "approved" ? "default" : "destructive",
      });

      // Refresh the data
      refetch();
    } catch (error: any) {
      toast({
        title: "Action failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Define table columns
  const columns: ColumnDef<BuildWithUserData>[] = [
    {
      id: "title",
      accessorKey: "title",
      header: "Build Title",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.title}</div>
          <div className="text-xs text-muted-foreground truncate max-w-[300px]">
            {row.original.description}
          </div>
        </div>
      ),
    },
    {
      id: "submitted_by",
      accessorKey: "user_name",
      header: "Submitted By",
    },
    {
      id: "submitted_at",
      accessorKey: "created_at",
      header: "Date",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>
            {new Date(row.original.created_at).toLocaleDateString()}
          </span>
        </div>
      ),
    },
    {
      id: "parts",
      accessorKey: "parts_count",
      header: "Parts",
      cell: ({ row }) => (
        <Badge variant="outline" className="font-mono">
          {row.original.parts_count}
        </Badge>
      ),
    },
    {
      id: "mods",
      accessorKey: "mods_count",
      header: "Mods",
      cell: ({ row }) => (
        <Badge variant="outline" className="font-mono">
          {row.original.mods_count}
        </Badge>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const build = row.original;
        
        return (
          <div className="flex items-center justify-end gap-2">
            {activeTab === "pending" ? (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => window.open(`/builds/${build.id}`, "_blank")}
                >
                  <EyeIcon className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 text-green-500 hover:text-green-600 hover:bg-green-100"
                  onClick={() => updateBuildStatus(build.id, "approved")}
                >
                  <CheckCircle className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-100"
                  onClick={() => updateBuildStatus(build.id, "rejected")}
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => window.open(`/builds/${build.id}`, "_blank")}>
                    View Build
                  </DropdownMenuItem>
                  {activeTab === "rejected" && (
                    <DropdownMenuItem onClick={() => updateBuildStatus(build.id, "approved")}>
                      Approve Build
                    </DropdownMenuItem>
                  )}
                  {activeTab === "approved" && (
                    <DropdownMenuItem onClick={() => updateBuildStatus(build.id, "rejected")}>
                      Reject Build
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Build Approvals</h2>
          <p className="text-muted-foreground">
            Review and manage user-submitted 3D printer builds
          </p>
        </div>
      </div>

      <Tabs
        defaultValue="pending"
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as BuildStatus)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="pending">
            Pending
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected
          </TabsTrigger>
        </TabsList>
        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Pending Builds</CardTitle>
              <CardDescription>
                Review these builds to approve or reject them
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={columns}
                data={builds || []}
                isLoading={isLoading}
                emptyMessage="No pending builds to review"
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="approved">
          <Card>
            <CardHeader>
              <CardTitle>Approved Builds</CardTitle>
              <CardDescription>
                These builds have been approved and are visible to all users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={columns}
                data={builds || []}
                isLoading={isLoading}
                emptyMessage="No approved builds"
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="rejected">
          <Card>
            <CardHeader>
              <CardTitle>Rejected Builds</CardTitle>
              <CardDescription>
                These builds have been rejected and are not visible to users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={columns}
                data={builds || []}
                isLoading={isLoading}
                emptyMessage="No rejected builds"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
