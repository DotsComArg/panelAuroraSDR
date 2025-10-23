import { Calendar } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function MeetingsOverview() {
  return (
    <Card className="transition-all duration-300 hover:shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-primary" />
          <span>Reuniones Acordadas</span>
        </CardTitle>
        <CardDescription>
          Seguimiento de reuniones programadas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center py-12">
          <div className="text-center space-y-2">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-sm">¡Aún no tenemos datos!</p>
            <p className="text-xs text-muted-foreground max-w-xs">
              Configure el registro de reuniones en n8n para ver esta información.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
