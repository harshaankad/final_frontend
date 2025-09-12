import Spinner from "@/components/Spinner";

export default function LoadingPage() {
  return (
    <div className="flex items-center justify-center h-screen bg-black">
      <Spinner />
    </div>
  );
}
