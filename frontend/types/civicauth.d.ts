// Type definitions for @civic/auth
declare module "@civic/auth/nextjs" {
  export function handler(): any;
  export function createCivicAuthPlugin(config: any): any;
  export function getUser(): Promise<any>;
}

declare module "@civic/auth/nextjs/server" {
  export function getUser(): Promise<any>;
}

declare module "@civic/auth/react" {
  export interface SignInButtonProps {
    children: React.ReactNode;
  }
  export function SignInButton(props: SignInButtonProps): JSX.Element;
  export function useUser(): { user: any, isLoading: boolean };
}
