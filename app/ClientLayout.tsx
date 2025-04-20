"use client"

import type React from "react"

import { useState } from "react"
import { Inter } from "next/font/google"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, ShoppingCart, Package, LogIn, Menu, X, Zap } from "lucide-react"

import { cn } from "@/lib/utils"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Cart", href: "/cart", icon: ShoppingCart },
    { name: "Orders", href: "/orders", icon: Package },
    { name: "Login", href: "/login", icon: LogIn },
  ]

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen bg-gray-50">
          {/* Mobile sidebar toggle */}
          <button
            className="fixed top-4 left-4 z-50 rounded-full bg-primary p-2 text-white shadow-lg md:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Sidebar */}
          <div
            className={cn(
              "fixed inset-y-0 left-0 z-40 w-64 transform bg-gradient-to-b from-primary to-primary-dark text-white transition-transform duration-300 ease-in-out md:relative md:translate-x-0 shadow-xl",
              sidebarOpen ? "translate-x-0" : "-translate-x-full",
            )}
          >
            <div className="flex h-20 items-center justify-center border-b border-primary-light/20">
              <Zap className="mr-2 h-6 w-6 text-yellow-400" />
              <h1 className="text-xl font-bold">TechVolt</h1>
            </div>
            <nav className="mt-8">
              <ul className="space-y-2 px-4">
                {navItems.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center rounded-md px-4 py-3 text-sm font-medium transition-colors",
                        pathname === item.href
                          ? "bg-primary-light text-white"
                          : "text-gray-100 hover:bg-primary-light/50 hover:text-white",
                      )}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="rounded-lg bg-primary-light/30 p-4 text-center text-sm">
                <p>© 2023 TechVolt</p>
                <p className="mt-1 text-xs text-gray-300">Premium Electronics</p>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 overflow-auto">
            <main className="container mx-auto p-4 pt-16 md:p-8 md:pt-8">{children}</main>
          </div>
        </div>
      </body>
    </html>
  )
}
