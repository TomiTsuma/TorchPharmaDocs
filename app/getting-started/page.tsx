import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Getting Started | Torch Pharma",
  description: "Learn how to install and set up Torch Pharma for drug discovery",
}

export default function GettingStarted() {
  return (
    <main className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-4xl font-bold">Getting Started</h1>
      <p className="mb-8 text-lg text-muted-foreground">
        Follow these steps to install Torch Pharma and start building molecular machine learning models.
      </p>

      <h2 className="mb-4 mt-8 text-2xl font-semibold">Installation</h2>
      
      <h3 className="mb-3 mt-6 text-xl font-semibold">From PyPI</h3>
      <p className="mb-4">The simplest way to install Torch Pharma is via pip:</p>
      <pre className="mb-6 overflow-x-auto rounded-md bg-muted p-4">
        <code>pip install torch-pharma</code>
      </pre>

      <h3 className="mb-3 mt-6 text-xl font-semibold">From Source</h3>
      <p className="mb-4">For the latest development version, install from source:</p>
      <pre className="mb-6 overflow-x-auto rounded-md bg-muted p-4">
        <code>{`git clone https://github.com/TomiTsuma/torch-pharma.git
cd torch-pharma
pip install -e .`}</code>
      </pre>

      <h2 className="mb-4 mt-8 text-2xl font-semibold">Quick Example: Property Prediction</h2>
      <p className="mb-4">
        Here&apos;s a minimal example to train a Graph Convolutional Network for molecular property prediction:
      </p>
      <pre className="mb-6 overflow-x-auto rounded-md bg-muted p-4">
        <code>{`from torch_pharma.molecules import Molecule
from torch_pharma.models.gnn import GCN
from torch_pharma.tasks import PropertyPredictionTask
from torch_pharma.training import Trainer

# Create a molecule from SMILES
mol = Molecule.from_smiles("CCO")

# Initialize model and task
model = GCN(hidden_dim=128)
task = PropertyPredictionTask(model=model)

# Train the model
trainer = Trainer(max_epochs=10)
trainer.fit(task)`}</code>
      </pre>

      <h2 className="mb-4 mt-8 text-2xl font-semibold">Quick Example: Molecule Optimization</h2>
      <p className="mb-4">
        Use reinforcement learning to optimize molecular properties like drug-likeness (QED):
      </p>
      <pre className="mb-6 overflow-x-auto rounded-md bg-muted p-4">
        <code>{`from torch_pharma.rl.envs import MoleculeEnv
from torch_pharma.rl.agents import PPOAgent
from torch_pharma.training import Trainer

# Set up environment and agent
env = MoleculeEnv(task="optimize_qed")
agent = PPOAgent()

# Train the agent
trainer = Trainer(max_steps=10000)
trainer.fit(agent, env)`}</code>
      </pre>

      <h2 className="mb-4 mt-8 text-2xl font-semibold">Core Concepts</h2>
      
      <div className="mb-6 space-y-4">
        <div className="rounded-lg border p-4">
          <h3 className="mb-2 font-semibold">Molecules</h3>
          <p className="text-sm text-muted-foreground">
            The <code className="rounded bg-muted px-1">Molecule</code> class is the fundamental abstraction for representing chemical structures. It handles SMILES parsing, graph conversion, and featurization.
          </p>
        </div>

        <div className="rounded-lg border p-4">
          <h3 className="mb-2 font-semibold">Models</h3>
          <p className="text-sm text-muted-foreground">
            Neural network architectures designed for molecular learning, including GCN, MPNN, and graph transformers. All models follow a consistent interface.
          </p>
        </div>

        <div className="rounded-lg border p-4">
          <h3 className="mb-2 font-semibold">Tasks</h3>
          <p className="text-sm text-muted-foreground">
            Task definitions that encapsulate specific drug discovery objectives like property prediction, molecule generation, and binding affinity estimation.
          </p>
        </div>

        <div className="rounded-lg border p-4">
          <h3 className="mb-2 font-semibold">Trainer</h3>
          <p className="text-sm text-muted-foreground">
            A unified training abstraction that handles the training loop, checkpointing, callbacks, and experiment reproducibility.
          </p>
        </div>
      </div>

      <h2 className="mb-4 mt-8 text-2xl font-semibold">Running Tests</h2>
      <p className="mb-4">To verify your installation, run the test suite:</p>
      <pre className="mb-6 overflow-x-auto rounded-md bg-muted p-4">
        <code>pytest</code>
      </pre>

      <h2 className="mb-4 mt-8 text-2xl font-semibold">Next Steps</h2>
      <ul className="mb-4 list-inside list-disc space-y-2 text-muted-foreground">
        <li>Explore the <strong>Models</strong> section to learn about available neural architectures</li>
        <li>Check out <strong>Tasks</strong> to understand different drug discovery objectives</li>
        <li>See <strong>Reinforcement Learning</strong> for molecule optimization workflows</li>
        <li>Browse <strong>Examples</strong> for complete, runnable experiments</li>
      </ul>
    </main>
  )
}
