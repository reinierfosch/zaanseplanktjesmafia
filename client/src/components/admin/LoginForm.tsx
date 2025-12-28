import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminLoginSchema, type AdminLoginFormData } from "@/lib/validations";
import { useAdminAuth } from "@/hooks/useAdminAuth";

export function LoginForm() {
  const { login } = useAdminAuth();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdminLoginFormData>({
    resolver: zodResolver(adminLoginSchema),
  });

  const onSubmit = async (data: AdminLoginFormData) => {
    try {
      setError(null);
      await login(data.password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login mislukt");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <div className="industrial-box p-8 space-y-6">
        <div>
          <h1 className="text-4xl font-black uppercase mb-2">Admin Login</h1>
          <p className="text-gray-700 font-mono">Voer je wachtwoord in om in te loggen</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">
              Wachtwoord <span className="text-red-600">*</span>
            </Label>
            <Input
              id="password"
              type="password"
              {...register("password")}
              placeholder="Wachtwoord"
              className="font-mono"
              autoFocus
            />
            {errors.password && (
              <p className="text-red-600 text-sm">{errors.password.message}</p>
            )}
          </div>

          {error && (
            <p className="text-red-600 text-sm font-bold" role="alert">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-black text-white hover:bg-gray-800 font-black uppercase"
          >
            {isSubmitting ? "Inloggen..." : "Inloggen"}
          </Button>
        </form>
      </div>
    </div>
  );
}

