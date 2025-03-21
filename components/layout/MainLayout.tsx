'use client';

import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, LogOut } from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Tech Interviewer AI</h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">User Name</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    user@example.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Left Sidebar - Calendar */}
          <div className="col-span-3">
            <Card className="p-4">
              <h2 className="text-lg font-semibold mb-4">Activity Calendar</h2>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
              />
            </Card>
          </div>

          {/* Main Content */}
          <div className="col-span-6">
            {children}
          </div>

          {/* Right Sidebar - Past Assessments */}
          <div className="col-span-3">
            <Card className="p-4">
              <h2 className="text-lg font-semibold mb-4">Past Assessments</h2>
              <div className="space-y-4">
                {/* Mock past assessments */}
                <div className="border rounded-lg p-3">
                  <h3 className="font-medium">Two Sum</h3>
                  <p className="text-sm text-gray-500">Easy • 85%</p>
                </div>
                <div className="border rounded-lg p-3">
                  <h3 className="font-medium">Valid Parentheses</h3>
                  <p className="text-sm text-gray-500">Easy • 92%</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 