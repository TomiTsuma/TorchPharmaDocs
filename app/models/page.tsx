import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Models | Torch Pharma",
  description: "Overview of all neural network models in torch_pharma",
}

export default function ModelsPage() {
  return (
    <main className="mx-auto max-w-3xl">
      <h1 className="mb-2 text-4xl font-bold">Models</h1>
      <p className="mb-8 text-muted-foreground">
        <code>torch_pharma.models</code> — Neural network architectures for molecular machine learning
      </p>

      <p className="mb-6">
        The models package contains all neural network architecture implementations. It is organized into
        sub-packages by architectural family and by use-case, enabling clean composition between
        generative and discriminative models.
      </p>

      <h2 className="mb-4 mt-8 text-2xl font-semibold">Package Map</h2>
      <pre className="mb-8 overflow-x-auto rounded-md bg-muted p-4 text-sm">
        <code>{`torch_pharma.models/
  diffusion/          EquivariantVariationalDiffusion + noise schedules
  dynamics/           EGNNDynamics, GCPNetDynamics (denoising backbones)
    attention/        Attention sub-modules for dynamics layers
  transformers/       Distribution utilities + sampling helpers
  gnn/                Classic GNNs (GCN, GAT, MPNN, GraphTransformer)
  ddpm/               Discrete Diffusion Probabilistic Model stubs
  protein/            Protein-encoder stub
  heads/              Classification & regression output heads
  layer/              GCPLayerNorm and other shared layer primitives
  dropout/            GCPDropout and other shared dropout primitives
  activation/         (see modules/activation.py)`}</code>
      </pre>

      <h2 className="mb-4 mt-8 text-2xl font-semibold">Generative Models</h2>
      <div className="mb-8 grid gap-4">
        <div className="rounded-lg border p-5">
          <div className="mb-1 flex items-start justify-between">
            <h3 className="font-semibold">Equivariant Variational Diffusion (EVD)</h3>
            <span className="ml-2 rounded bg-green-100 px-2 py-0.5 text-xs text-green-800 dark:bg-green-900 dark:text-green-100">
              Production
            </span>
          </div>
          <p className="mb-3 text-sm text-muted-foreground">
            Continuous-time SE(3)-equivariant diffusion model for 3D molecule generation. Jointly diffuses
            3D atom coordinates and atom-type features with a learnable or fixed noise schedule.
          </p>
          <Link href="/models/diffusion" className="text-sm font-medium hover:underline">
            View Documentation →
          </Link>
        </div>

        <div className="rounded-lg border p-5">
          <div className="mb-1 flex items-start justify-between">
            <h3 className="font-semibold">DDPM (Discrete Diffusion)</h3>
            <span className="ml-2 rounded bg-yellow-100 px-2 py-0.5 text-xs text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
              Stub
            </span>
          </div>
          <p className="mb-3 text-sm text-muted-foreground">
            Placeholder for discrete denoising diffusion probabilistic models operating on SMILES or
            graph token sequences. Implementation pending.
          </p>
        </div>
      </div>

      <h2 className="mb-4 mt-8 text-2xl font-semibold">Denoising Backbones (Dynamics)</h2>
      <div className="mb-8 grid gap-4">
        <div className="rounded-lg border p-5">
          <div className="mb-1 flex items-start justify-between">
            <h3 className="font-semibold">EGNNDynamics</h3>
            <span className="ml-2 rounded bg-green-100 px-2 py-0.5 text-xs text-green-800 dark:bg-green-900 dark:text-green-100">
              Production
            </span>
          </div>
          <p className="mb-3 text-sm text-muted-foreground">
            A deep stack of sparse EGNN layers with optional Fourier distance encoding, soft edge
            attention, coordinate normalization, and global linear attention. Efficient for large
            molecules.
          </p>
          <Link href="/models/dynamics" className="text-sm font-medium hover:underline">
            View Documentation →
          </Link>
        </div>

        <div className="rounded-lg border p-5">
          <div className="mb-1 flex items-start justify-between">
            <h3 className="font-semibold">GCPNetDynamics</h3>
            <span className="ml-2 rounded bg-green-100 px-2 py-0.5 text-xs text-green-800 dark:bg-green-900 dark:text-green-100">
              Production
            </span>
          </div>
          <p className="mb-3 text-sm text-muted-foreground">
            Geometry-Complete Perceptron network. Uses per-edge local SE(3) frames for direction-aware,
            geometry-complete message passing. More expressive than EGNN but computationally heavier.
          </p>
          <Link href="/models/dynamics" className="text-sm font-medium hover:underline">
            View Documentation →
          </Link>
        </div>
      </div>

      <h2 className="mb-4 mt-8 text-2xl font-semibold">Graph Neural Networks</h2>
      <div className="mb-8 overflow-x-auto rounded-md border">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-2 text-left">Class</th>
              <th className="px-4 py-2 text-left">File</th>
              <th className="px-4 py-2 text-left">Architecture</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            <tr>
              <td className="px-4 py-2 font-mono">GCN</td>
              <td className="px-4 py-2 font-mono">gnn/gcn.py</td>
              <td className="px-4 py-2">Graph Convolutional Network (Kipf & Welling 2017)</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono">GAT</td>
              <td className="px-4 py-2 font-mono">gnn/gat.py</td>
              <td className="px-4 py-2">Graph Attention Network (Veličković 2018)</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono">MPNN</td>
              <td className="px-4 py-2 font-mono">gnn/mpnn.py</td>
              <td className="px-4 py-2">Message Passing Neural Network (Gilmer 2017)</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono">GraphTransformer</td>
              <td className="px-4 py-2 font-mono">gnn/graph_transformer.py</td>
              <td className="px-4 py-2">Transformer-style attention over molecular graphs</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="mb-4 mt-8 text-2xl font-semibold">Transformer Utilities</h2>
      <div className="mb-8 rounded-lg border p-5">
        <h3 className="mb-2 font-semibold">Distributions & Sampling Helpers</h3>
        <p className="mb-3 text-sm text-muted-foreground">
          NumNodesDistribution, PropertiesDistribution, CategoricalDistribution, Queue, gradient flow
          logging, and conditional sampling sweeps.
        </p>
        <Link href="/models/transformers" className="text-sm font-medium hover:underline">
          View Documentation →
        </Link>
      </div>

      <h2 className="mb-4 mt-8 text-2xl font-semibold">Output Heads</h2>
      <div className="mb-8 overflow-x-auto rounded-md border">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-2 text-left">Module</th>
              <th className="px-4 py-2 text-left">Task</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            <tr>
              <td className="px-4 py-2 font-mono">heads.classification</td>
              <td className="px-4 py-2">Multi-layer MLP for binary or multiclass molecule classification</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono">heads.regression</td>
              <td className="px-4 py-2">MLP regression head for continuous property prediction</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="mb-4 mt-8 text-2xl font-semibold">Shared Primitives</h2>
      <div className="mb-6 overflow-x-auto rounded-md border">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-2 text-left">Module</th>
              <th className="px-4 py-2 text-left">Contents</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            <tr>
              <td className="px-4 py-2 font-mono">layer/__init__.py</td>
              <td className="px-4 py-2">
                <code>GCPLayerNorm</code> — layer norm that handles <code>ScalarVector</code> inputs,
                with a <code>use_gcp_norm</code> flag to apply custom vector norms
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono">dropout/</td>
              <td className="px-4 py-2">
                <code>GCPDropout</code> — dropout that consistently zeros both scalar and vector channels
                of a <code>ScalarVector</code>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  )
}
