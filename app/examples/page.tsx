import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Examples | Torch Pharma",
  description: "Runnable examples and experiments for Torch Pharma",
}

export default function Examples() {
  return (
    <main className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-4xl font-bold">Examples</h1>
      <p className="mb-8 text-lg text-muted-foreground">
        Complete, runnable examples demonstrating Torch Pharma capabilities. Each example is aligned with key research papers in molecular machine learning.
      </p>

      <h2 className="mb-4 mt-8 text-2xl font-semibold">Molecular Property Prediction</h2>
      <p className="mb-4">
        Train a GCN model on the QM9 dataset for quantum mechanical property prediction.
      </p>
      
      <div className="mb-4 rounded-lg border p-4">
        <p className="mb-2 font-medium">Datasets</p>
        <p className="text-sm text-muted-foreground">QM9, ZINC</p>
        <p className="mb-2 mt-4 font-medium">Models</p>
        <p className="text-sm text-muted-foreground">GCN, MPNN</p>
        <p className="mb-2 mt-4 font-medium">Related Work</p>
        <ul className="list-inside list-disc text-sm text-muted-foreground">
          <li>Gilmer et al., &quot;Neural Message Passing for Quantum Chemistry&quot; (2017)</li>
          <li>Wu et al., &quot;MoleculeNet: A Benchmark for Molecular Machine Learning&quot; (2018)</li>
        </ul>
      </div>

      <p className="mb-2 font-medium">Run the example:</p>
      <pre className="mb-6 overflow-x-auto rounded-md bg-muted p-4">
        <code>python examples/property_prediction/train_qm9.py</code>
      </pre>

      <p className="mb-2 font-medium">Full code:</p>
      <pre className="mb-6 overflow-x-auto rounded-md bg-muted p-4 text-sm">
        <code>{`# examples/property_prediction/train_qm9.py
from torch_pharma.datasets import QM9Dataset
from torch_pharma.models.gnn import MPNN
from torch_pharma.tasks import PropertyPredictionTask
from torch_pharma.training import Trainer

# Load QM9 dataset with HOMO-LUMO gap as target
dataset = QM9Dataset(
    root="data/qm9",
    target="gap",
    split_seed=42
)

train_loader, val_loader, test_loader = dataset.get_loaders(
    batch_size=32,
    split=[0.8, 0.1, 0.1]
)

# Initialize model
model = MPNN(
    node_dim=dataset.num_node_features,
    edge_dim=dataset.num_edge_features,
    hidden_dim=128,
    output_dim=1,
    num_message_passing=6
)

# Create task
task = PropertyPredictionTask(
    model=model,
    loss_fn="mse",
    metrics=["mae", "rmse", "r2"],
    lr=1e-3
)

# Train
trainer = Trainer(
    max_epochs=100,
    checkpoint_dir="checkpoints/qm9",
    early_stopping={"patience": 10, "metric": "val_mae"}
)

trainer.fit(task, train_loader, val_loader)

# Evaluate
results = trainer.evaluate(task, test_loader)
print(f"Test MAE: {results['mae']:.4f} eV")`}</code>
      </pre>

      <h2 className="mb-4 mt-8 text-2xl font-semibold">3D Molecule Generation</h2>
      <p className="mb-4">
        Generate 3D molecular structures using geometry-complete diffusion models.
      </p>

      <div className="mb-4 rounded-lg border p-4">
        <p className="mb-2 font-medium">Model</p>
        <p className="text-sm text-muted-foreground">Geometry-Complete Diffusion</p>
        <p className="mb-2 mt-4 font-medium">Related Work</p>
        <p className="text-sm text-muted-foreground">
          Morehead et al., &quot;Geometry-Complete Diffusion for 3D Molecule Generation and Optimization&quot; (2023)
        </p>
      </div>

      <p className="mb-2 font-medium">Run the example:</p>
      <pre className="mb-6 overflow-x-auto rounded-md bg-muted p-4">
        <code>python examples/molecule_generation/2302.04313/generate.py</code>
      </pre>

      <p className="mb-2 font-medium">Full code:</p>
      <pre className="mb-6 overflow-x-auto rounded-md bg-muted p-4 text-sm">
        <code>{`# examples/molecule_generation/2302.04313/generate.py
from torch_pharma.models.diffusion import GeometryCompleteDiffusion
from torch_pharma.tasks import MoleculeGenerationTask
from torch_pharma.training import Trainer
from torch_pharma.datasets import GEOM_QM9

# Load dataset for training
dataset = GEOM_QM9(root="data/geom_qm9")
train_loader = dataset.get_loader(batch_size=64)

# Initialize diffusion model
model = GeometryCompleteDiffusion(
    num_atom_types=dataset.num_atom_types,
    hidden_dim=256,
    num_layers=6,
    num_diffusion_steps=1000,
    noise_schedule="cosine"
)

# Create generation task
task = MoleculeGenerationTask(
    model=model,
    validation_metrics=["validity", "uniqueness", "novelty", "diversity"],
    chemistry_constraints=True
)

# Train
trainer = Trainer(max_epochs=500)
trainer.fit(task, train_loader)

# Generate molecules
molecules = task.generate(num_samples=1000)

# Evaluate
metrics = task.evaluate_generation(molecules)
print(f"Validity: {metrics['validity']:.2%}")
print(f"Uniqueness: {metrics['uniqueness']:.2%}")
print(f"Novelty: {metrics['novelty']:.2%}")`}</code>
      </pre>

      <h2 className="mb-4 mt-8 text-2xl font-semibold">RL-Based Molecule Optimization</h2>
      <p className="mb-4">
        Optimize molecular properties using reinforcement learning with PPO.
      </p>

      <div className="mb-4 rounded-lg border p-4">
        <p className="mb-2 font-medium">Objective</p>
        <p className="text-sm text-muted-foreground">Maximize drug-likeness (QED), minimize toxicity</p>
        <p className="mb-2 mt-4 font-medium">Environment</p>
        <p className="text-sm text-muted-foreground">Molecular graph editing</p>
        <p className="mb-2 mt-4 font-medium">Related Work</p>
        <ul className="list-inside list-disc text-sm text-muted-foreground">
          <li>Olivecrona et al., &quot;Molecular De-Novo Design through Deep Reinforcement Learning&quot; (2017)</li>
          <li>Zhou et al., &quot;Optimization of Molecules via Deep Reinforcement Learning&quot; (2019)</li>
        </ul>
      </div>

      <p className="mb-2 font-medium">Run the example:</p>
      <pre className="mb-6 overflow-x-auto rounded-md bg-muted p-4">
        <code>python examples/rl_optimization/optimize_qed.py</code>
      </pre>

      <p className="mb-2 font-medium">Full code:</p>
      <pre className="mb-6 overflow-x-auto rounded-md bg-muted p-4 text-sm">
        <code>{`# examples/rl_optimization/optimize_qed.py
from torch_pharma.rl.envs import MoleculeEnv
from torch_pharma.rl.agents import PPOAgent
from torch_pharma.rl.rewards import QED, LogP, RewardFunction
from torch_pharma.training import Trainer

# Multi-objective reward
reward_fn = RewardFunction(
    components=[
        (QED(), 0.7),
        (LogP(target=2.5, tolerance=1.0), 0.3)
    ]
)

# Create environment
env = MoleculeEnv(
    task="custom",
    reward_fn=reward_fn,
    max_steps=50,
    action_space="atom_edit"
)

# Initialize PPO agent
agent = PPOAgent(
    state_dim=env.observation_space.shape[0],
    action_dim=env.action_space.n,
    hidden_dim=256,
    lr=3e-4,
    clip_ratio=0.2
)

# Train
trainer = Trainer(
    max_steps=100000,
    eval_interval=5000,
    log_dir="experiments/qed_optimization"
)

trainer.fit(agent, env)

# Generate optimized molecules
optimized = []
for _ in range(100):
    state = env.reset()
    done = False
    while not done:
        action = agent.select_action(state, deterministic=True)
        state, _, done, info = env.step(action)
    optimized.append(info["molecule"])

# Report results
qed_scores = [mol.qed for mol in optimized]
print(f"Mean QED: {np.mean(qed_scores):.3f}")
print(f"Max QED: {np.max(qed_scores):.3f}")`}</code>
      </pre>

      <h2 className="mb-4 mt-8 text-2xl font-semibold">Binding Affinity Prediction</h2>
      <p className="mb-4">
        Predict protein-ligand binding affinity using graph-based encoders.
      </p>

      <div className="mb-4 rounded-lg border p-4">
        <p className="mb-2 font-medium">Task</p>
        <p className="text-sm text-muted-foreground">Predict protein-ligand binding strength</p>
        <p className="mb-2 mt-4 font-medium">Datasets</p>
        <p className="text-sm text-muted-foreground">Davis, KIBA, PDBbind</p>
        <p className="mb-2 mt-4 font-medium">Related Work</p>
        <p className="text-sm text-muted-foreground">
          Ozturk et al., &quot;DeepDTA: Deep Drug-Target Binding Affinity Prediction&quot; (2018)
        </p>
      </div>

      <p className="mb-2 font-medium">Run the example:</p>
      <pre className="mb-6 overflow-x-auto rounded-md bg-muted p-4">
        <code>python examples/binding_affinity/train_binding.py</code>
      </pre>

      <p className="mb-2 font-medium">Full code:</p>
      <pre className="mb-6 overflow-x-auto rounded-md bg-muted p-4 text-sm">
        <code>{`# examples/binding_affinity/train_binding.py
from torch_pharma.datasets import DavisDataset
from torch_pharma.models.gnn import ProteinLigandGNN
from torch_pharma.tasks import BindingAffinityTask
from torch_pharma.training import Trainer

# Load Davis dataset
dataset = DavisDataset(root="data/davis")
train_loader, val_loader, test_loader = dataset.get_loaders(
    batch_size=32,
    split=[0.8, 0.1, 0.1]
)

# Protein-ligand interaction model
model = ProteinLigandGNN(
    ligand_dim=64,
    protein_dim=128,
    hidden_dim=256,
    num_layers=4
)

# Create task
task = BindingAffinityTask(
    model=model,
    metrics=["mse", "ci", "rm2"]  # Concordance Index, Modified R²
)

# Train
trainer = Trainer(
    max_epochs=200,
    early_stopping={"patience": 20, "metric": "val_ci", "mode": "max"}
)

trainer.fit(task, train_loader, val_loader)

# Evaluate
results = trainer.evaluate(task, test_loader)
print(f"MSE: {results['mse']:.4f}")
print(f"CI: {results['ci']:.4f}")`}</code>
      </pre>

      <h2 className="mb-4 mt-8 text-2xl font-semibold">Contributing Examples</h2>
      <p className="mb-4">
        We welcome contributions of new examples. To add an example:
      </p>
      <ul className="mb-6 list-inside list-disc space-y-2 text-muted-foreground">
        <li>Create a new directory under <code className="rounded bg-muted px-1">examples/</code></li>
        <li>Include a complete, runnable script</li>
        <li>Add a README with dataset instructions and expected results</li>
        <li>Reference relevant research papers</li>
      </ul>
    </main>
  )
}
