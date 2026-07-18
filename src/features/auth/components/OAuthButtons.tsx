import { useLogin } from '../hooks/useLogin';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { Button } from '../../../shared/components/ui/button';

export function OAuthButtons() {
  const { loginWithGoogle, loginWithGitHub } = useLogin();

  return (
    <div className="grid grid-cols-1 gap-3">
      <Button
        variant="outline"
        size="lg"
        onClick={loginWithGoogle}
        className="w-full justify-start gap-3"
      >
        <FcGoogle className="h-5 w-5" />
        <span>Continue with Google</span>
      </Button>
      <Button
        variant="outline"
        size="lg"
        onClick={loginWithGitHub}
        className="w-full justify-start gap-3"
      >
        <FaGithub className="h-5 w-5 text-text-primary" />
        <span>Continue with GitHub</span>
      </Button>
    </div>
  );
}