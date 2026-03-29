import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "API Reference | Torch Pharma",
  description: "Complete API documentation for Torch Pharma",
}

export default function ApiReference() {
  return (
    <main className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-4xl font-bold">API Reference</h1>
      <p className="mb-8 text-lg text-muted-foreground">
        Complete reference documentation for the Torch Pharma API.
      </p>

      <h2 className="mb-4 mt-8 text-2xl font-semibold">torch_pharma.molecules</h2>
      <p className="mb-4">Core molecular representation classes.</p>

      <h3 className="mb-3 mt-6 text-xl font-semibold">Molecule</h3>
      <p className="mb-4">The fundamental class for representing chemical structures.</p>
      <pre className="mb-4 overflow-x-auto rounded-md bg-muted p-4">
        <code>{`class Molecule:
    """A molecular structure with graph representation."""
    
    @classmethod
    def from_smiles(cls, smiles: str) -> Molecule:
        """Create a Molecule from a SMILES string."""
    
    @classmethod
    def from_mol_file(cls, path: str) -> Molecule:
        """Load a Molecule from a MOL/SDF file."""
    
    def to_graph(self) -> Data:
        """Convert to PyTorch Geometric Data object."""
    
    def get_fingerprint(self, fp_type: str = "morgan", radius: int = 2) -> np.ndarray:
        """Compute molecular fingerprint."""
    
    @property
    def smiles(self) -> str:
        """Canonical SMILES representation."""
    
    @property
    def num_atoms(self) -> int:
        """Number of atoms in the molecule."""
    
    @property
    def molecular_weight(self) -> float:
        """Molecular weight in Daltons."""`}</code>
      </pre>

      <h3 className="mb-3 mt-6 text-xl font-semibold">Featurizer</h3>
      <p className="mb-4">Atom and bond feature extraction.</p>
      <pre className="mb-4 overflow-x-auto rounded-md bg-muted p-4">
        <code>{`class AtomFeaturizer:
    """Extract atom-level features."""
    
    def __init__(
        self,
        atom_types: List[str] = None,
        include_charge: bool = True,
        include_hybridization: bool = True,
        include_aromaticity: bool = True
    )
    
    def __call__(self, mol: Molecule) -> torch.Tensor:
        """Return atom feature matrix of shape (num_atoms, num_features)."""

class BondFeaturizer:
    """Extract bond-level features."""
    
    def __init__(
        self,
        include_bond_type: bool = True,
        include_conjugation: bool = True,
        include_ring: bool = True
    )
    
    def __call__(self, mol: Molecule) -> torch.Tensor:
        """Return bond feature matrix of shape (num_bonds, num_features)."""`}</code>
      </pre>

      <h2 className="mb-4 mt-8 text-2xl font-semibold">torch_pharma.models</h2>
      <p className="mb-4">Neural network architectures for molecular learning.</p>

      <h3 className="mb-3 mt-6 text-xl font-semibold">MoleculeModel (Base Class)</h3>
      <pre className="mb-4 overflow-x-auto rounded-md bg-muted p-4">
        <code>{`class MoleculeModel(nn.Module):
    """Base class for all molecular models."""
    
    def forward(self, batch: Batch) -> torch.Tensor:
        """Forward pass. Must be implemented by subclasses."""
        raise NotImplementedError
    
    def encode(self, batch: Batch) -> torch.Tensor:
        """Encode molecules to latent representations."""
    
    @classmethod
    def from_config(cls, config: Dict) -> MoleculeModel:
        """Instantiate model from configuration dictionary."""`}</code>
      </pre>

      <h3 className="mb-3 mt-6 text-xl font-semibold">GCN</h3>
      <pre className="mb-4 overflow-x-auto rounded-md bg-muted p-4">
        <code>{`class GCN(MoleculeModel):
    """Graph Convolutional Network."""
    
    def __init__(
        self,
        input_dim: int = 32,
        hidden_dim: int = 128,
        output_dim: int = 1,
        num_layers: int = 3,
        dropout: float = 0.0,
        batch_norm: bool = True,
        residual: bool = True
    )`}</code>
      </pre>

      <h3 className="mb-3 mt-6 text-xl font-semibold">MPNN</h3>
      <pre className="mb-4 overflow-x-auto rounded-md bg-muted p-4">
        <code>{`class MPNN(MoleculeModel):
    """Message Passing Neural Network."""
    
    def __init__(
        self,
        node_dim: int = 32,
        edge_dim: int = 16,
        hidden_dim: int = 128,
        output_dim: int = 1,
        num_message_passing: int = 6,
        readout: str = "sum"  # "sum", "mean", "attention"
    )`}</code>
      </pre>

      <h2 className="mb-4 mt-8 text-2xl font-semibold">torch_pharma.tasks</h2>
      <p className="mb-4">Task definitions for drug discovery workflows.</p>

      <h3 className="mb-3 mt-6 text-xl font-semibold">PropertyPredictionTask</h3>
      <pre className="mb-4 overflow-x-auto rounded-md bg-muted p-4">
        <code>{`class PropertyPredictionTask:
    """Task for molecular property prediction."""
    
    def __init__(
        self,
        model: MoleculeModel,
        dataset: Dataset = None,
        loss_fn: str = "mse",  # "mse", "mae", "bce", "cross_entropy"
        metrics: List[str] = ["mae", "rmse"],
        optimizer: str = "adam",
        lr: float = 1e-3
    )
    
    def training_step(self, batch: Batch) -> Dict:
        """Single training step."""
    
    def validation_step(self, batch: Batch) -> Dict:
        """Single validation step."""`}</code>
      </pre>

      <h3 className="mb-3 mt-6 text-xl font-semibold">MoleculeGenerationTask</h3>
      <pre className="mb-4 overflow-x-auto rounded-md bg-muted p-4">
        <code>{`class MoleculeGenerationTask:
    """Task for molecule generation."""
    
    def __init__(
        self,
        model: MoleculeModel,
        validation_metrics: List[str] = ["validity", "uniqueness", "novelty"],
        chemistry_constraints: bool = True,
        reference_dataset: Dataset = None
    )
    
    def generate(self, num_samples: int) -> List[Molecule]:
        """Generate molecules."""
    
    def evaluate_generation(self, molecules: List[Molecule]) -> Dict:
        """Compute generation metrics."""`}</code>
      </pre>

      <h2 className="mb-4 mt-8 text-2xl font-semibold">torch_pharma.training</h2>
      <p className="mb-4">Training engine and utilities.</p>

      <h3 className="mb-3 mt-6 text-xl font-semibold">Trainer</h3>
      <pre className="mb-4 overflow-x-auto rounded-md bg-muted p-4">
        <code>{`class Trainer:
    """Unified training abstraction."""
    
    def __init__(
        self,
        max_epochs: int = None,
        max_steps: int = None,
        val_check_interval: int = 1,
        checkpoint_dir: str = None,
        callbacks: List[Callback] = None,
        accelerator: str = "auto",  # "cpu", "gpu", "auto"
        devices: int = 1,
        seed: int = 42
    )
    
    def fit(
        self,
        task: Task,
        train_loader: DataLoader = None,
        val_loader: DataLoader = None
    ) -> Dict:
        """Train the model."""
    
    def evaluate(self, task: Task, test_loader: DataLoader) -> Dict:
        """Evaluate on test set."""
    
    def predict(self, task: Task, data_loader: DataLoader) -> torch.Tensor:
        """Generate predictions."""`}</code>
      </pre>

      <h2 className="mb-4 mt-8 text-2xl font-semibold">torch_pharma.evaluation</h2>
      <p className="mb-4">Metrics and evaluation utilities.</p>

      <h3 className="mb-3 mt-6 text-xl font-semibold">Metrics</h3>
      <pre className="mb-4 overflow-x-auto rounded-md bg-muted p-4">
        <code>{`# Property prediction metrics
from torch_pharma.evaluation import mae, rmse, r2, pearson_r

# Generation metrics
from torch_pharma.evaluation import validity, uniqueness, novelty, diversity

# Drug-likeness scores
from torch_pharma.evaluation import qed, logp, sas, tpsa

# Usage
from torch_pharma.evaluation import Evaluator

evaluator = Evaluator(metrics=["mae", "rmse", "r2"])
results = evaluator(predictions, targets)`}</code>
      </pre>

      <h2 className="mb-4 mt-8 text-2xl font-semibold">torch_pharma.rl</h2>
      <p className="mb-4">Reinforcement learning modules.</p>

      <h3 className="mb-3 mt-6 text-xl font-semibold">MoleculeEnv</h3>
      <pre className="mb-4 overflow-x-auto rounded-md bg-muted p-4">
        <code>{`class MoleculeEnv:
    """Gym-compatible environment for molecular optimization."""
    
    def __init__(
        self,
        task: str,  # "optimize_qed", "optimize_logp", etc.
        max_steps: int = 50,
        action_space: str = "atom_edit",
        reward_fn: RewardFunction = None,
        starting_molecule: str = None
    )
    
    def reset(self) -> np.ndarray:
        """Reset environment and return initial state."""
    
    def step(self, action: int) -> Tuple[np.ndarray, float, bool, Dict]:
        """Take action and return (state, reward, done, info)."""
    
    @property
    def observation_space(self) -> gym.Space:
        """Observation space specification."""
    
    @property
    def action_space(self) -> gym.Space:
        """Action space specification."""`}</code>
      </pre>

      <h2 className="mb-4 mt-8 text-2xl font-semibold">Types</h2>
      <pre className="mb-6 overflow-x-auto rounded-md bg-muted p-4">
        <code>{`from typing import TypedDict, List, Optional
import torch
from torch_geometric.data import Data, Batch

class ModelConfig(TypedDict):
    type: str
    hidden_dim: int
    num_layers: int
    dropout: float

class TrainingConfig(TypedDict):
    max_epochs: int
    learning_rate: float
    batch_size: int
    early_stopping: Optional[dict]

class ExperimentConfig(TypedDict):
    task: dict
    model: ModelConfig
    training: TrainingConfig`}</code>
      </pre>
    </main>
  )
}
