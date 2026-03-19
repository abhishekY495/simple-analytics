import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import BrowserVisitor from "./environment/browser-visitor";
import DeviceVisitor from "./environment/device-visitor";
import OsVisitor from "./environment/os-visitor";

export default function Environment({
  websiteId,
  start,
  end,
  accessToken,
}: {
  websiteId: string;
  start: string;
  end: string;
  accessToken: string;
}) {
  return (
    <Card className="rounded px-2">
      <Tabs defaultValue="browser" className="gap-1">
        <CardHeader className="gap-0">
          <CardTitle className="text-xl">Environment</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col h-[420px]">
          <TabsList variant="line" className="border-b mb-4 w-full">
            <TabsTrigger value="browser" className="cursor-pointer">
              <span className="text-muted-foreground">Browser</span>
            </TabsTrigger>
            <TabsTrigger value="os" className="cursor-pointer">
              <span className="text-muted-foreground">OS</span>
            </TabsTrigger>
            <TabsTrigger value="device" className="cursor-pointer">
              <span className="text-muted-foreground">Device</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="browser">
            <BrowserVisitor
              websiteId={websiteId}
              start={start}
              end={end}
              accessToken={accessToken}
            />
          </TabsContent>
          <TabsContent value="os">
            <OsVisitor
              websiteId={websiteId}
              start={start}
              end={end}
              accessToken={accessToken}
            />
          </TabsContent>
          <TabsContent value="device">
            <DeviceVisitor
              websiteId={websiteId}
              start={start}
              end={end}
              accessToken={accessToken}
            />
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
}
