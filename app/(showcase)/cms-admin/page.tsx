"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, XCircle, RefreshCw, Settings, Image, FileText } from "lucide-react"
import { useSiteSettings, useBrandAssets } from "@/lib/hooks/use-cms-content"

interface ConfigStatus {
  cms: { configured: boolean; baseId: string; apiKey: string }
  directory: { configured: boolean; baseId: string; apiKey: string }
  branding: { configured: boolean; baseId: string; apiKey: string }
}

export default function CMSAdminPage() {
  const [configStatus, setConfigStatus] = useState<ConfigStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const { settings, loading: settingsLoading } = useSiteSettings()
  const { assets, loading: assetsLoading } = useBrandAssets()

  const fetchConfigStatus = async () => {
    try {
      setRefreshing(true)
      const response = await fetch('/api/cms/config-status')
      const result = await response.json()
      if (result.success) {
        setConfigStatus(result.data)
      }
    } catch (error) {
      console.error('Error fetching config status:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchConfigStatus()
  }, [])

  const getStatusIcon = (configured: boolean) => {
    return configured ? (
      <CheckCircle className="h-5 w-5 text-green-500" />
    ) : (
      <XCircle className="h-5 w-5 text-red-500" />
    )
  }

  const getStatusBadge = (configured: boolean) => {
    return (
      <Badge variant={configured ? "default" : "destructive"}>
        {configured ? "Configured" : "Not Configured"}
      </Badge>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">CMS Administration</h1>
          <p className="text-muted-foreground">
            Manage your Airtable CMS configuration and content
          </p>
        </div>

        <Tabs defaultValue="status" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="status">Configuration</TabsTrigger>
            <TabsTrigger value="settings">Site Settings</TabsTrigger>
            <TabsTrigger value="assets">Brand Assets</TabsTrigger>
            <TabsTrigger value="help">Help</TabsTrigger>
          </TabsList>

          <TabsContent value="status" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Airtable Configuration Status
                  </CardTitle>
                  <CardDescription>
                    Check the status of your Airtable base connections
                  </CardDescription>
                </div>
                <Button
                  onClick={fetchConfigStatus}
                  disabled={refreshing}
                  variant="outline"
                  size="sm"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">Loading configuration...</div>
                ) : configStatus ? (
                  <div className="space-y-4">
                    {Object.entries(configStatus).map(([baseType, config]) => (
                      <div key={baseType} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(config.configured)}
                          <div>
                            <h3 className="font-medium capitalize">{baseType} Base</h3>
                            <p className="text-sm text-muted-foreground">
                              Base ID: {config.baseId}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              API Key: {config.apiKey}
                            </p>
                          </div>
                        </div>
                        {getStatusBadge(config.configured)}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-red-500">
                    Failed to load configuration status
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Site Settings
                </CardTitle>
                <CardDescription>
                  Current site settings from Airtable CMS
                </CardDescription>
              </CardHeader>
              <CardContent>
                {settingsLoading ? (
                  <div className="text-center py-8">Loading settings...</div>
                ) : Object.keys(settings).length > 0 ? (
                  <div className="space-y-3">
                    {Object.entries(settings).map(([key, setting]) => (
                      <div key={key} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <h4 className="font-medium">{key}</h4>
                          <p className="text-sm text-muted-foreground">
                            {setting.value}
                          </p>
                        </div>
                        <Badge variant="outline">{setting.type}</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No settings found. Check your Airtable configuration.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assets" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Image className="h-5 w-5" />
                  Brand Assets
                </CardTitle>
                <CardDescription>
                  Current brand assets from Airtable CMS
                </CardDescription>
              </CardHeader>
              <CardContent>
                {assetsLoading ? (
                  <div className="text-center py-8">Loading assets...</div>
                ) : assets.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {assets.map((asset) => (
                      <div key={asset.id} className="border rounded-lg p-4">
                        <h4 className="font-medium mb-2">{asset.assetName}</h4>
                        <Badge variant="outline" className="mb-2">
                          {asset.assetType}
                        </Badge>
                        {asset.files.length > 0 && (
                          <div className="mt-2">
                            <img
                              src={asset.files[0].url}
                              alt={asset.altText || asset.assetName}
                              className="w-full h-32 object-contain border rounded"
                            />
                          </div>
                        )}
                        <p className="text-sm text-muted-foreground mt-2">
                          Usage: {asset.usageContext.join(', ')}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No assets found. Check your Airtable configuration.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="help" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Setup Instructions</CardTitle>
                <CardDescription>
                  How to configure your Airtable CMS
                </CardDescription>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <h3>1. Get Your Airtable API Key</h3>
                <p>
                  Go to <a href="https://airtable.com/account" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    Airtable Account Settings
                  </a> and generate an API key.
                </p>

                <h3>2. Configure Environment Variables</h3>
                <p>Add these variables to your <code>.env.local</code> file:</p>
                <pre className="bg-muted p-4 rounded text-sm overflow-x-auto">
{`AIRTABLE_API_KEY=your_airtable_api_key_here
AIRTABLE_CMS_BASE_ID=appnXs2ZIMD5zoeIl
AIRTABLE_DIR_BASE_ID=appXkzIVdu52PYrfz
AIRTABLE_BRAND_BASE_ID=appXpx55IZC8IPNi9`}
                </pre>

                <h3>3. Restart Development Server</h3>
                <p>After updating environment variables, restart your development server.</p>

                <h3>4. Populate Content</h3>
                <p>Add content to your Airtable bases:</p>
                <ul>
                  <li><strong>Site Settings:</strong> Configure site title, hero content, etc.</li>
                  <li><strong>Brand Assets:</strong> Upload logos and images</li>
                  <li><strong>Website Pages:</strong> Create and manage page content</li>
                </ul>

                <h3>Need Help?</h3>
                <p>Check the <code>CMS_SETUP.md</code> file for detailed instructions.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}