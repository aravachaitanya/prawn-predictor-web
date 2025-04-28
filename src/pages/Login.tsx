
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Loader2Icon, Mail, Phone } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { AuthService } from '@/services/authService';

// Email form validation schema
const emailFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

// Phone form validation schema
const phoneFormSchema = z.object({
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  code: z.string().length(6, { message: "Verification code must be 6 digits" }),
});

type EmailFormValues = z.infer<typeof emailFormSchema>;
type PhoneFormValues = z.infer<typeof phoneFormSchema>;

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [codeSent, setCodeSent] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);

  // Email login form
  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Phone login form
  const phoneForm = useForm<PhoneFormValues>({
    resolver: zodResolver(phoneFormSchema),
    defaultValues: {
      phone: '',
      code: '',
    },
  });

  // Handle email login
  const onEmailSubmit = async (data: EmailFormValues) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Call the authentication service
      const result = await AuthService.authenticateWithEmail(data.email, data.password);
      
      if (result.success) {
        // Login the user
        login({ email: data.email });
        
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        
        navigate('/');
      } else {
        setError(result.message || "Invalid email or password");
      }
    } catch (error) {
      setError("An error occurred while logging in. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle phone login
  const onPhoneSubmit = async (data: PhoneFormValues) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Call the authentication service
      const result = await AuthService.authenticateWithPhone(data.phone, data.code);
      
      if (result.success) {
        // Login the user
        login({ phone: data.phone });
        
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        
        navigate('/');
      } else {
        setError(result.message || "Invalid phone number or verification code");
      }
    } catch (error) {
      setError("An error occurred while logging in. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Send verification code
  const handleSendCode = async () => {
    const phoneValue = phoneForm.getValues("phone");
    
    if (!phoneValue || phoneValue.length < 10) {
      phoneForm.setError("phone", { 
        type: "manual", 
        message: "Please enter a valid phone number" 
      });
      return;
    }

    setSendingCode(true);
    setError(null);
    
    try {
      const result = await AuthService.sendVerificationCode(phoneValue);
      
      if (result.success) {
        setCodeSent(true);
        toast({
          title: "Verification code sent",
          description: result.message || "Please check your phone for the verification code",
        });
      } else {
        setError(result.message || "Failed to send verification code");
      }
    } catch (error) {
      setError("An error occurred while sending verification code. Please try again.");
      console.error(error);
    } finally {
      setSendingCode(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-100 to-white dark:from-sky-900/40 dark:to-gray-950 px-4">
      <Card className="w-full max-w-md shadow-lg border-sky-200 dark:border-sky-800">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-sky-800 dark:text-sky-300">Login</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <Tabs defaultValue="email" className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>Email</span>
              </TabsTrigger>
              <TabsTrigger value="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>Phone</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="email">
              <Form {...emailForm}>
                <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
                  <FormField
                    control={emailForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="your.email@example.com" 
                            {...field} 
                            disabled={isLoading}
                            className="focus-visible:ring-sky-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={emailForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="••••••••" 
                            {...field} 
                            disabled={isLoading}
                            className="focus-visible:ring-sky-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-sky-500 hover:bg-sky-600 dark:bg-sky-600 dark:hover:bg-sky-700" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                        Logging in...
                      </>
                    ) : (
                      "Log in with Email"
                    )}
                  </Button>
                </form>
              </Form>
            </TabsContent>
            
            <TabsContent value="phone">
              <Form {...phoneForm}>
                <form onSubmit={phoneForm.handleSubmit(onPhoneSubmit)} className="space-y-4">
                  <FormField
                    control={phoneForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="+12345678901" 
                            {...field} 
                            disabled={isLoading || codeSent}
                            className="focus-visible:ring-sky-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {!codeSent ? (
                    <Button 
                      type="button" 
                      onClick={handleSendCode}
                      className="w-full bg-sky-500 hover:bg-sky-600 dark:bg-sky-600 dark:hover:bg-sky-700" 
                      disabled={sendingCode}
                    >
                      {sendingCode ? (
                        <>
                          <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                          Sending code...
                        </>
                      ) : (
                        "Send Verification Code"
                      )}
                    </Button>
                  ) : (
                    <>
                      <FormField
                        control={phoneForm.control}
                        name="code"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Verification Code</FormLabel>
                            <FormControl>
                              <div className="flex justify-center">
                                <InputOTP maxLength={6} {...field}>
                                  <InputOTPGroup>
                                    <InputOTPSlot index={0} />
                                    <InputOTPSlot index={1} />
                                    <InputOTPSlot index={2} />
                                    <InputOTPSlot index={3} />
                                    <InputOTPSlot index={4} />
                                    <InputOTPSlot index={5} />
                                  </InputOTPGroup>
                                </InputOTP>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex flex-col gap-2">
                        <Button 
                          type="submit" 
                          className="w-full bg-sky-500 hover:bg-sky-600 dark:bg-sky-600 dark:hover:bg-sky-700" 
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                              Logging in...
                            </>
                          ) : (
                            "Verify & Log in"
                          )}
                        </Button>
                        
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={() => {
                            setCodeSent(false);
                            phoneForm.setValue("code", "");
                          }}
                          disabled={isLoading || sendingCode}
                        >
                          Change Phone Number
                        </Button>
                        
                        <Button 
                          type="button" 
                          variant="link"
                          onClick={handleSendCode}
                          disabled={isLoading || sendingCode}
                          className="text-sm"
                        >
                          {sendingCode ? (
                            <>
                              <Loader2Icon className="mr-2 h-3 w-3 animate-spin" />
                              Resending code...
                            </>
                          ) : (
                            "Resend Verification Code"
                          )}
                        </Button>
                      </div>
                    </>
                  )}
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-muted-foreground text-center">
            <span>Don't have an account? </span>
            <Button 
              variant="link" 
              className="p-0 h-auto text-sky-600 dark:text-sky-400" 
              onClick={() => navigate('/register')}
            >
              Sign up
            </Button>
          </div>
          <div className="text-xs text-center text-muted-foreground">
            Demo credentials: Email: admin@example.com / password <br />
            Phone: +12345678901 / any 6-digit code
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
