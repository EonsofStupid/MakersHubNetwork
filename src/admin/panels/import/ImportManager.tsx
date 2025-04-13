
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UploadCloud, FileJson, FileSpreadsheet, FileText, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

export default function ImportManager() {
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState("upload");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Simulate file upload
    if (e.target.files && e.target.files.length > 0) {
      setIsUploading(true);
      setUploadProgress(0);
      
      // Simulate progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsUploading(false);
            toast({
              title: "Upload Complete",
              description: "Your file has been uploaded and is ready for processing."
            });
            setSelectedTab("validate");
            return 100;
          }
          return prev + 10;
        });
      }, 500);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Import Manager</h1>
          <p className="text-muted-foreground">
            Upload and import data to your platform
          </p>
        </div>
      </div>
      
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="upload">Upload</TabsTrigger>
          <TabsTrigger value="validate">Validate</TabsTrigger>
          <TabsTrigger value="map">Map Fields</TabsTrigger>
          <TabsTrigger value="import">Import</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload Data File</CardTitle>
              <CardDescription>
                Select a file to upload. Supported formats: CSV, Excel, JSON
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="border-dashed hover:border-primary/50 transition-colors duration-300 flex flex-col items-center justify-center p-6 cursor-pointer" onClick={() => document.getElementById("csv-upload")?.click()}>
                    <FileSpreadsheet className="h-10 w-10 text-green-500 mb-4" />
                    <p className="font-medium">CSV</p>
                    <p className="text-xs text-muted-foreground mt-1 text-center">
                      Upload comma-separated values file
                    </p>
                    <input
                      id="csv-upload"
                      type="file"
                      accept=".csv"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </Card>
                  
                  <Card className="border-dashed hover:border-primary/50 transition-colors duration-300 flex flex-col items-center justify-center p-6 cursor-pointer" onClick={() => document.getElementById("excel-upload")?.click()}>
                    <FileSpreadsheet className="h-10 w-10 text-blue-500 mb-4" />
                    <p className="font-medium">Excel</p>
                    <p className="text-xs text-muted-foreground mt-1 text-center">
                      Upload Excel spreadsheet file
                    </p>
                    <input
                      id="excel-upload"
                      type="file"
                      accept=".xlsx,.xls"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </Card>
                  
                  <Card className="border-dashed hover:border-primary/50 transition-colors duration-300 flex flex-col items-center justify-center p-6 cursor-pointer" onClick={() => document.getElementById("json-upload")?.click()}>
                    <FileJson className="h-10 w-10 text-yellow-500 mb-4" />
                    <p className="font-medium">JSON</p>
                    <p className="text-xs text-muted-foreground mt-1 text-center">
                      Upload JSON data file
                    </p>
                    <input
                      id="json-upload"
                      type="file"
                      accept=".json"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </Card>
                </div>
                
                {isUploading && (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Uploading file...</Label>
                      <span className="text-sm">{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}
                
                <div>
                  <h3 className="font-medium mb-2">Import Templates</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Download a template file to ensure your data is properly formatted for import.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm">
                      User Template
                    </Button>
                    <Button variant="outline" size="sm">
                      Product Template
                    </Button>
                    <Button variant="outline" size="sm">
                      Content Template
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="validate" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Validate Data</CardTitle>
              <CardDescription>
                Review potential issues before importing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 rounded-lg bg-green-500/10 flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-green-500">File Valid</h3>
                    <p className="text-sm">
                      Your file was successfully validated. There were 8 minor issues found that won't prevent import.
                    </p>
                  </div>
                </div>
                
                <div className="border rounded-lg">
                  <div className="p-4 border-b">
                    <h3 className="font-medium flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      Issues Found (8)
                    </h3>
                  </div>
                  
                  <div className="divide-y">
                    {[
                      "Row 5: Email address is not valid",
                      "Row 12: Required field 'name' is empty",
                      "Row 18: Date format is incorrect"
                    ].map((issue, index) => (
                      <div key={index} className="p-4 flex justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500">
                            Warning
                          </Badge>
                          <span className="text-sm">{issue}</span>
                        </div>
                        <Button variant="ghost" size="sm">Fix</Button>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-between items-center gap-2">
                  <Button variant="outline" onClick={() => setSelectedTab("upload")}>
                    Back
                  </Button>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Switch id="skip-warnings" />
                      <Label htmlFor="skip-warnings" className="text-sm">Skip Warnings</Label>
                    </div>
                    <Button onClick={() => setSelectedTab("map")}>
                      Continue to Mapping
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="map" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Map Fields</CardTitle>
              <CardDescription>
                Map your file columns to system fields
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <p className="text-sm text-muted-foreground">
                  This step helps match your data fields with the system fields. Auto-matching has been applied where possible.
                </p>
                
                <div className="border rounded-lg">
                  <div className="grid grid-cols-1 divide-y">
                    {[
                      { source: "email", target: "email", matched: true },
                      { source: "full_name", target: "name", matched: true },
                      { source: "address1", target: "address_line_1", matched: true },
                      { source: "address2", target: "address_line_2", matched: true },
                      { source: "zip", target: "postal_code", matched: true },
                      { source: "telephone", target: "phone", matched: true },
                      { source: "user_role", target: "", matched: false }
                    ].map((field, index) => (
                      <div key={index} className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                        <div>
                          <p className="text-sm font-medium">{field.source}</p>
                          <p className="text-xs text-muted-foreground">Source field</p>
                        </div>
                        
                        <div className="flex items-center justify-center">
                          <Badge variant={field.matched ? "outline" : "destructive"} className={field.matched ? "bg-green-500/10 text-green-500" : ""}>
                            {field.matched ? "Matched" : "Not Matched"}
                          </Badge>
                        </div>
                        
                        <div>
                          <Label htmlFor={`field-${index}`} className="sr-only">Target Field</Label>
                          <Input 
                            id={`field-${index}`}
                            value={field.target}
                            placeholder="Select target field"
                            className={!field.matched ? "border-destructive" : ""}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-between items-center gap-2">
                  <Button variant="outline" onClick={() => setSelectedTab("validate")}>
                    Back
                  </Button>
                  <Button onClick={() => setSelectedTab("import")}>
                    Continue to Import
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="import" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Import Data</CardTitle>
              <CardDescription>
                Final settings and import process
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="update-option">Update Existing Records</Label>
                      <div className="flex items-center gap-2">
                        <Switch id="update-option" />
                        <span className="text-sm text-muted-foreground">
                          If enabled, existing records will be updated
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="notify-option">Email Notification</Label>
                      <div className="flex items-center gap-2">
                        <Switch id="notify-option" defaultChecked />
                        <span className="text-sm text-muted-foreground">
                          Receive email when import is completed
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dry-run">Test Run</Label>
                      <div className="flex items-center gap-2">
                        <Switch id="dry-run" defaultChecked />
                        <span className="text-sm text-muted-foreground">
                          Perform a test run without committing changes
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="schedule-option">Schedule Import</Label>
                      <div className="flex items-center gap-2">
                        <Switch id="schedule-option" />
                        <span className="text-sm text-muted-foreground">
                          Schedule for later instead of running now
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <h3 className="font-medium mb-2">Import Summary</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Source file:</span>
                      <span>data-import.csv</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total records:</span>
                      <span>154</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fields mapped:</span>
                      <span>6/7 (86%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Warnings:</span>
                      <span>8</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center gap-2">
                  <Button variant="outline" onClick={() => setSelectedTab("map")}>
                    Back
                  </Button>
                  <Button
                    onClick={() => {
                      toast({
                        title: "Import Started",
                        description: "Your data import has been started. You'll be notified when it's complete."
                      });
                      setSelectedTab("history");
                    }}
                  >
                    Start Import
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Import History</CardTitle>
              <CardDescription>
                View past and ongoing imports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="rounded-md border">
                  <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                      <thead>
                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                          <th className="h-12 px-4 text-left align-middle font-medium">File Name</th>
                          <th className="h-12 px-4 text-left align-middle font-medium">Type</th>
                          <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                          <th className="h-12 px-4 text-left align-middle font-medium">Records</th>
                          <th className="h-12 px-4 text-left align-middle font-medium">Date</th>
                          <th className="h-12 px-4 text-right align-middle font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { name: "data-import.csv", type: "CSV", status: "processing", records: 154, date: new Date() },
                          { name: "users-export.xlsx", type: "Excel", status: "completed", records: 87, date: new Date(Date.now() - 86400000) },
                          { name: "product-data.json", type: "JSON", status: "completed", records: 245, date: new Date(Date.now() - 172800000) },
                          { name: "customer-backup.csv", type: "CSV", status: "failed", records: 312, date: new Date(Date.now() - 259200000) }
                        ].map((import_, index) => (
                          <tr key={index} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <td className="p-4">{import_.name}</td>
                            <td className="p-4">
                              <Badge variant="outline">
                                {import_.type}
                              </Badge>
                            </td>
                            <td className="p-4">
                              <Badge variant="outline" className={
                                import_.status === "completed" 
                                  ? "bg-green-500/10 text-green-500"
                                  : import_.status === "processing"
                                    ? "bg-blue-500/10 text-blue-500"
                                    : "bg-red-500/10 text-red-500"
                              }>
                                {import_.status === "processing" && (
                                  <svg className="mr-1 h-3 w-3 animate-spin text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                )}
                                {import_.status}
                              </Badge>
                            </td>
                            <td className="p-4">{import_.records}</td>
                            <td className="p-4 text-muted-foreground">
                              {import_.date.toLocaleDateString()}
                            </td>
                            <td className="p-4 text-right">
                              <Button variant="ghost" size="sm">View</Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedTab("upload")}
                    className="flex items-center gap-2"
                  >
                    <UploadCloud className="h-4 w-4" />
                    New Import
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
