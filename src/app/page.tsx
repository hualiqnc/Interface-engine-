import InferenceForm from '@/components/InferenceForm'

export default function Page() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Propositional Logic Inference Engine</h1>
      <InferenceForm />
    </div>
  )
}