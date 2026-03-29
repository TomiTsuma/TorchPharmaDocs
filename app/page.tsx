import type { Metadata } from "next"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: "Introduction | Torch Pharma",
  description: "A PyTorch-native framework for drug discovery and molecular deep learning",
}

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl">
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <Badge variant="secondary">PyPI</Badge>
        <Badge variant="secondary">Testing</Badge>
        <Badge variant="secondary">Docs</Badge>
        <Badge variant="secondary">Coverage</Badge>
      </div>

      <h1 className="mb-6 text-4xl font-bold">Torch Pharma</h1>
      
      <p className="mb-6 text-lg text-muted-foreground">
        A PyTorch-native framework for drug discovery and molecular deep learning. It provides a unified interface for building, training, and evaluating models across molecular property prediction, molecule generation, and reinforcement learning-based optimization.
      </p>

      <p className="mb-8">
        The framework is designed to bridge the gap between graph-based deep learning libraries and domain-specific drug discovery toolkits by integrating molecular representations, learning algorithms, and evaluation pipelines into a single modular system.
      </p>

      <h2 className="mb-4 mt-8 text-2xl font-semibold">Motivation</h2>
      <p className="mb-4">
        Current tooling in molecular machine learning is fragmented. Libraries such as PyTorch Geometric provide strong primitives for graph learning, while DeepChem offers domain-specific utilities. However, there is no unified framework that:
      </p>
      <ul className="mb-6 list-inside list-disc space-y-2 text-muted-foreground">
        <li>Treats drug discovery tasks as first-class abstractions</li>
        <li>Provides a singular framework for collecting, featurizing, and training on molecular datasets</li>
        <li>Integrates GNNs, RL, and other deep learning models with molecular modeling</li>
        <li>Provides consistent training and evaluation pipelines</li>
        <li>Assesses validity of de novo generated molecules</li>
      </ul>
      <p className="mb-8">
        Torch Pharma addresses these limitations by introducing a task-oriented and extensible framework tailored for drug discovery workflows that runs on YAML files.
      </p>

      <h2 className="mb-4 mt-8 text-2xl font-semibold">Key Features</h2>
      
      <div className="mb-6 grid gap-4">
        <div className="rounded-lg border p-4">
          <h3 className="mb-2 font-semibold">Molecular Representations</h3>
          <p className="text-sm text-muted-foreground">
            SMILES to graph conversion, atom and bond featurization, RDKit integration, PoseBuster and Geometry-Complete integration for 3D structure generation.
          </p>
        </div>
        
        <div className="rounded-lg border p-4">
          <h3 className="mb-2 font-semibold">Neural Network Models</h3>
          <p className="text-sm text-muted-foreground">
            Graph Neural Networks (Diffusion, Convolutional, GANs), graph transformers, and extensible architecture for protein and multimodal models.
          </p>
        </div>
        
        <div className="rounded-lg border p-4">
          <h3 className="mb-2 font-semibold">Drug Discovery Tasks</h3>
          <p className="text-sm text-muted-foreground">
            Property prediction, molecule generation, binding affinity prediction, and toxicity prediction.
          </p>
        </div>
        
        <div className="rounded-lg border p-4">
          <h3 className="mb-2 font-semibold">Reinforcement Learning</h3>
          <p className="text-sm text-muted-foreground">
            Molecular environments for optimization, reward functions based on chemical properties, support for DQN, PPO, and SAC.
          </p>
        </div>
      </div>

      <h2 className="mb-4 mt-8 text-2xl font-semibold">Quick Start</h2>
      <p className="mb-4">
        Get started with Torch Pharma in just a few steps:
      </p>
      <pre className="mb-6 overflow-x-auto rounded-md bg-muted p-4">
        <code>pip install torch-pharma</code>
      </pre>

      <div className="mb-8 flex flex-wrap gap-4">
        <Link 
          href="/getting-started" 
          className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Get Started
        </Link>
        <Link 
          href="/api-reference" 
          className="inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
        >
          API Reference
        </Link>
      </div>

      <h2 className="mb-4 mt-8 text-2xl font-semibold">Project Structure</h2>
      <pre className="mb-6 overflow-x-auto rounded-md bg-muted p-4 text-sm">
        <code>{`torch_pharma/
  molecules/      # molecular abstractions
  models/         # neural architectures
  tasks/          # task definitions
  rl/             # reinforcement learning modules
  training/       # training engine
  evaluation/     # metrics and benchmarks`}</code>
      </pre>

      <h2 className="mb-4 mt-8 text-2xl font-semibold">Citation</h2>
      <p className="mb-4">If you use Torch Pharma in your research, please cite:</p>
      <pre className="mb-6 overflow-x-auto rounded-md bg-muted p-4 text-sm">
        <code>{`@software{torchpharma2026,
  title={Torch Pharma: A PyTorch Framework for Drug Discovery},
  author={Your Name},
  year={2026}
}`}</code>
      </pre>

      <h2 className="mb-4 mt-8 text-2xl font-semibold">License</h2>
      <p className="mb-4">
        This project is licensed under the MIT License.
      </p>
    </main>
  )
}
