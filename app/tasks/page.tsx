import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Tasks | Torch Pharma",
  description: "Drug discovery task definitions and workflows",
}

export default function Tasks() {
  return (
    <main className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-4xl font-bold">Tasks</h1>
      <p className="mb-8 text-lg text-muted-foreground">
        Torch Pharma provides first-class abstractions for common drug discovery tasks, each with specialized training pipelines and evaluation metrics.
      </p>

      <h2 className="mb-4 mt-8 text-2xl font-semibold">Property Prediction</h2>
      <p className="mb-4">
        Predict molecular properties from structure. This is the most common task in molecular machine learning, used for predicting solubility, toxicity, binding affinity, and other physicochemical properties.
      </p>
      <pre className="mb-6 overflow-x-auto rounded-md bg-muted p-4">
        <code>{`from torch_pharma.tasks import PropertyPredictionTask
from torch_pharma.models.gnn import GCN
from torch_pharma.datasets import QM9Dataset

# Load dataset
dataset = QM9Dataset(target="homo")

# Create task
model = GCN(hidden_dim=128, output_dim=1)
task = PropertyPredictionTask(
    model=model,
    dataset=dataset,
    loss_fn="mse",
    metrics=["mae", "rmse", "r2"]
)`}</code>
      </pre>

      <h3 className="mb-3 mt-6 text-xl font-semibold">Supported Datasets</h3>
      <ul className="mb-6 list-inside list-disc space-y-2 text-muted-foreground">
        <li><strong>QM9</strong>: Quantum mechanical properties of small molecules</li>
        <li><strong>ZINC</strong>: Drug-like molecules for virtual screening</li>
        <li><strong>MoleculeNet</strong>: Benchmark collection including BBBP, Tox21, ESOL, and more</li>
      </ul>

      <h2 className="mb-4 mt-8 text-2xl font-semibold">Molecule Generation</h2>
      <p className="mb-4">
        Generate novel molecules with desired properties. Supports both graph-based and SMILES-based generation approaches.
      </p>
      <pre className="mb-6 overflow-x-auto rounded-md bg-muted p-4">
        <code>{`from torch_pharma.tasks import MoleculeGenerationTask
from torch_pharma.models.diffusion import MoleculeDiffusion

model = MoleculeDiffusion(
    num_atom_types=10,
    hidden_dim=256
)

task = MoleculeGenerationTask(
    model=model,
    validation_metrics=["validity", "uniqueness", "novelty"],
    chemistry_constraints=True  # Enforce valency rules
)`}</code>
      </pre>

      <h3 className="mb-3 mt-6 text-xl font-semibold">Generation Metrics</h3>
      <div className="mb-6 space-y-3">
        <div className="rounded-lg border p-3">
          <p className="font-medium">Validity</p>
          <p className="text-sm text-muted-foreground">Percentage of generated molecules that are chemically valid</p>
        </div>
        <div className="rounded-lg border p-3">
          <p className="font-medium">Uniqueness</p>
          <p className="text-sm text-muted-foreground">Percentage of unique molecules among valid generations</p>
        </div>
        <div className="rounded-lg border p-3">
          <p className="font-medium">Novelty</p>
          <p className="text-sm text-muted-foreground">Percentage of generated molecules not in the training set</p>
        </div>
        <div className="rounded-lg border p-3">
          <p className="font-medium">Diversity</p>
          <p className="text-sm text-muted-foreground">Structural diversity measured by Tanimoto similarity</p>
        </div>
      </div>

      <h2 className="mb-4 mt-8 text-2xl font-semibold">Binding Affinity Prediction</h2>
      <p className="mb-4">
        Predict the binding strength between drug molecules and protein targets, essential for drug-target interaction modeling.
      </p>
      <pre className="mb-6 overflow-x-auto rounded-md bg-muted p-4">
        <code>{`from torch_pharma.tasks import BindingAffinityTask
from torch_pharma.models.gnn import ProteinLigandGNN

model = ProteinLigandGNN(
    ligand_dim=64,
    protein_dim=128,
    hidden_dim=256
)

task = BindingAffinityTask(
    model=model,
    dataset="davis",  # or "kiba", "pdbbind"
    metrics=["mse", "ci", "rm2"]  # CI = Concordance Index
)`}</code>
      </pre>

      <h2 className="mb-4 mt-8 text-2xl font-semibold">Toxicity Prediction</h2>
      <p className="mb-4">
        Predict various toxicity endpoints to filter out potentially harmful drug candidates early in the discovery process.
      </p>
      <pre className="mb-6 overflow-x-auto rounded-md bg-muted p-4">
        <code>{`from torch_pharma.tasks import ToxicityPredictionTask
from torch_pharma.models.gnn import MPNN

model = MPNN(hidden_dim=128)

task = ToxicityPredictionTask(
    model=model,
    dataset="tox21",
    endpoints=["NR-AR", "NR-ER", "SR-ARE"],  # Select specific endpoints
    class_weights="balanced"  # Handle class imbalance
)`}</code>
      </pre>

      <h2 className="mb-4 mt-8 text-2xl font-semibold">Task Configuration</h2>
      <p className="mb-4">
        Tasks can be fully configured via YAML for reproducible experiments:
      </p>
      <pre className="mb-6 overflow-x-auto rounded-md bg-muted p-4">
        <code>{`# config/experiment.yaml
task:
  type: PropertyPrediction
  dataset:
    name: QM9
    target: homo
    split: [0.8, 0.1, 0.1]
  
model:
  type: GCN
  hidden_dim: 128
  num_layers: 4

training:
  max_epochs: 100
  learning_rate: 0.001
  batch_size: 32
  early_stopping:
    patience: 10
    metric: val_mae`}</code>
      </pre>

      <h2 className="mb-4 mt-8 text-2xl font-semibold">Evaluation</h2>
      <p className="mb-4">
        Each task includes domain-specific evaluation metrics:
      </p>
      <pre className="mb-6 overflow-x-auto rounded-md bg-muted p-4">
        <code>{`from torch_pharma.evaluation import Evaluator

evaluator = Evaluator(task)
results = evaluator.evaluate(test_loader)

print(f"MAE: {results['mae']:.4f}")
print(f"RMSE: {results['rmse']:.4f}")
print(f"R²: {results['r2']:.4f}")`}</code>
      </pre>
    </main>
  )
}
