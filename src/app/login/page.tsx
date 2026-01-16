"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from "next/link"

const FormSchema = z.object({
  email: z.string().min(1, "L'email est requis").email("Email invalide"),
  password: z.string().min(1, "Le mot de passe est requis"),
})

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    try {
        const result = await signIn("credentials", {
            redirect: false,
            email: values.email,
            password: values.password,
        })

        if (result?.error) {
            setError("Email ou mot de passe invalide")
            return
        }

        router.push("/")
        router.refresh()
    } catch (err) {
        setError("Une erreur est survenue")
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-muted/50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Se connecter</CardTitle>
          <CardDescription>
            Entrez votre email et votre mot de passe pour accéder à votre compte.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {error && (
                <div className="p-3 text-sm text-white bg-destructive rounded-md">
                    {error}
                </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="email">Email</label>
              <Input id="email" type="email" placeholder="m@exemple.com" {...form.register("email")} />
               {form.formState.errors.email && (
                <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                 <label className="text-sm font-medium" htmlFor="password">Mot de passe</label>
                 <Link href="#" className="text-xs text-muted-foreground hover:underline">Mot de passe oublié ?</Link>
              </div>
              <Input id="password" type="password" {...form.register("password")} />
               {form.formState.errors.password && (
                <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Connexion en cours..." : "Se connecter"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
                Vous n'avez pas de compte ?{" "}
                <Link href="/register" className="text-primary hover:underline">
                    S'inscrire
                </Link>
            </p>
        </CardFooter>
      </Card>
    </div>
  )
}
