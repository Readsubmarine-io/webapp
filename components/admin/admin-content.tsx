import { ProjectsManager } from '@/components/admin/projects-manager'
import { SettingsManager } from '@/components/admin/settings-manager'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function AdminContent() {
  return (
    <div className="w-full pt-5">
      <Tabs defaultValue="projects" className="w-full">
        <TabsList className="w-full justify-start bg-transparent border-b h-auto p-0 space-x-4 sm:space-x-8 overflow-x-auto font-bold">
          <TabsTrigger
            value="projects"
            className="text-sm sm:text-base data-[state=active]:text-power-pump-button data-[state=active]:border-b-2 data-[state=active]:border-power-pump-button pb-2 sm:pb-4 rounded-none border-b-2 border-transparent whitespace-nowrap"
          >
            Projects
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="text-sm sm:text-base data-[state=active]:text-power-pump-button data-[state=active]:border-b-2 data-[state=active]:border-power-pump-button pb-2 sm:pb-4 rounded-none border-b-2 border-transparent whitespace-nowrap"
          >
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="pt-6">
          <ProjectsManager />
        </TabsContent>

        <TabsContent value="settings" className="pt-6">
          <SettingsManager />
        </TabsContent>
      </Tabs>
    </div>
  )
}
