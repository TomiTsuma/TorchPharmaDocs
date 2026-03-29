import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Reinforcement Learning | Torch Pharma",
  description: "RL-based molecular optimization and drug design",
}

export default function ReinforcementLearning() {
  return (
    <main className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-4xl font-bold">Reinforcement Learning</h1>
      <p className="mb-8 text-lg text-muted-foreground">
        Torch Pharma provides reinforcement learning tools for molecular optimization, enabling the design of molecules with desired properties through iterative refinement.
      </p>

      <h2 className="mb-4 mt-8 text-2xl font-semibold">Molecular Environments</h2>
      <p className="mb-4">
        The <code className="rounded bg-muted px-1">MoleculeEnv</code> provides a gym-compatible environment for molecular optimization tasks.
      </p>
      <pre className="mb-6 overflow-x-auto rounded-md bg-muted p-4">
        <code>{`from torch_pharma.rl.envs import MoleculeEnv

# Create environment for QED optimization
env = MoleculeEnv(
    task="optimize_qed",
    max_steps=50,
    action_space="atom_edit",  # or "fragment_edit", "smiles_edit"
    reward_shaping=True
)

# Environment interface
state = env.reset()
action = agent.select_action(state)
next_state, reward, done, info = env.step(action)`}</code>
      </pre>

      <h3 className="mb-3 mt-6 text-xl font-semibold">Available Tasks</h3>
      <div className="mb-6 space-y-3">
        <div className="rounded-lg border p-3">
          <p className="font-medium">optimize_qed</p>
          <p className="text-sm text-muted-foreground">Maximize drug-likeness score (Quantitative Estimate of Drug-likeness)</p>
        </div>
        <div className="rounded-lg border p-3">
          <p className="font-medium">optimize_logp</p>
          <p className="text-sm text-muted-foreground">Optimize lipophilicity (partition coefficient)</p>
        </div>
        <div className="rounded-lg border p-3">
          <p className="font-medium">minimize_toxicity</p>
          <p className="text-sm text-muted-foreground">Minimize predicted toxicity endpoints</p>
        </div>
        <div className="rounded-lg border p-3">
          <p className="font-medium">multi_objective</p>
          <p className="text-sm text-muted-foreground">Optimize multiple properties simultaneously</p>
        </div>
      </div>

      <h2 className="mb-4 mt-8 text-2xl font-semibold">RL Agents</h2>
      <p className="mb-4">
        Torch Pharma includes implementations of popular RL algorithms adapted for molecular optimization.
      </p>

      <h3 className="mb-3 mt-6 text-xl font-semibold">PPO (Proximal Policy Optimization)</h3>
      <p className="mb-4">
        A stable, sample-efficient policy gradient method recommended for most molecular optimization tasks.
      </p>
      <pre className="mb-6 overflow-x-auto rounded-md bg-muted p-4">
        <code>{`from torch_pharma.rl.agents import PPOAgent

agent = PPOAgent(
    state_dim=env.observation_space.shape[0],
    action_dim=env.action_space.n,
    hidden_dim=256,
    lr=3e-4,
    clip_ratio=0.2,
    entropy_coef=0.01,
    value_coef=0.5
)`}</code>
      </pre>

      <h3 className="mb-3 mt-6 text-xl font-semibold">DQN (Deep Q-Network)</h3>
      <p className="mb-4">
        Value-based method suitable for discrete action spaces in molecular editing.
      </p>
      <pre className="mb-6 overflow-x-auto rounded-md bg-muted p-4">
        <code>{`from torch_pharma.rl.agents import DQNAgent

agent = DQNAgent(
    state_dim=env.observation_space.shape[0],
    action_dim=env.action_space.n,
    hidden_dim=256,
    lr=1e-4,
    gamma=0.99,
    epsilon_start=1.0,
    epsilon_end=0.01,
    epsilon_decay=0.995,
    buffer_size=100000,
    batch_size=64
)`}</code>
      </pre>

      <h3 className="mb-3 mt-6 text-xl font-semibold">SAC (Soft Actor-Critic)</h3>
      <p className="mb-4">
        Maximum entropy RL for continuous action spaces, useful for fine-grained molecular modifications.
      </p>
      <pre className="mb-6 overflow-x-auto rounded-md bg-muted p-4">
        <code>{`from torch_pharma.rl.agents import SACAgent

agent = SACAgent(
    state_dim=env.observation_space.shape[0],
    action_dim=env.action_space.shape[0],
    hidden_dim=256,
    lr=3e-4,
    alpha=0.2,  # Temperature parameter
    tau=0.005,  # Soft update coefficient
    gamma=0.99
)`}</code>
      </pre>

      <h2 className="mb-4 mt-8 text-2xl font-semibold">Reward Functions</h2>
      <p className="mb-4">
        Define custom reward functions based on chemical properties:
      </p>
      <pre className="mb-6 overflow-x-auto rounded-md bg-muted p-4">
        <code>{`from torch_pharma.rl.rewards import RewardFunction, QED, LogP, SAS

# Single objective
reward_fn = QED()

# Multi-objective with weights
reward_fn = RewardFunction(
    components=[
        (QED(), 0.5),
        (LogP(target=2.5), 0.3),
        (SAS(), 0.2)  # Synthetic Accessibility Score
    ],
    aggregation="weighted_sum"
)

# Use in environment
env = MoleculeEnv(task="custom", reward_fn=reward_fn)`}</code>
      </pre>

      <h2 className="mb-4 mt-8 text-2xl font-semibold">Training Loop</h2>
      <p className="mb-4">
        Complete training example with the unified Trainer:
      </p>
      <pre className="mb-6 overflow-x-auto rounded-md bg-muted p-4">
        <code>{`from torch_pharma.rl.envs import MoleculeEnv
from torch_pharma.rl.agents import PPOAgent
from torch_pharma.training import Trainer

# Setup
env = MoleculeEnv(task="optimize_qed")
agent = PPOAgent()

# Train
trainer = Trainer(
    max_steps=100000,
    eval_interval=1000,
    checkpoint_interval=5000,
    log_dir="experiments/qed_optimization"
)

trainer.fit(agent, env)

# Evaluate
results = trainer.evaluate(agent, env, num_episodes=100)
print(f"Mean reward: {results['mean_reward']:.3f}")
print(f"Best QED: {results['best_qed']:.3f}")`}</code>
      </pre>

      <h2 className="mb-4 mt-8 text-2xl font-semibold">Research References</h2>
      <p className="mb-4">
        Torch Pharma&apos;s RL implementations are inspired by key research papers:
      </p>
      <ul className="mb-6 list-inside list-disc space-y-2 text-muted-foreground">
        <li>Olivecrona et al., &quot;Molecular De-Novo Design through Deep Reinforcement Learning&quot; (2017)</li>
        <li>Zhou et al., &quot;Optimization of Molecules via Deep Reinforcement Learning&quot; (2019)</li>
      </ul>
    </main>
  )
}
