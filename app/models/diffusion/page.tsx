import type { Metadata } from "next"
import { ApiEntry, ApiTable } from "@/components/api-entry"

export const metadata: Metadata = {
  title: "torch_pharma.models.diffusion | Torch Pharma",
  description: "API reference for the diffusion module — EquivariantVariationalDiffusion, noise schedules",
}

export default function DiffusionPage() {
  return (
    <main className="mx-auto max-w-3xl">
      <h1 className="mb-2 text-3xl font-bold">torch_pharma.models.diffusion</h1>
      <p className="mb-8 text-sm text-muted-foreground">
        3D equivariant diffusion models for de-novo molecule generation.
      </p>

      {/* ── Index table ── */}
      <h2 className="api-category">Classes</h2>
      <ApiTable rows={[
        { name: "EquivariantVariationalDiffusion", href: "#evd", description: "Continuous-time SE(3)-equivariant variational diffusion model for joint 3D coordinate and atom-type generation." },
        { name: "PredefinedNoiseSchedule",         href: "#pns", description: "Fixed analytic noise schedule (cosine or polynomial) mapping normalised time t → log-SNR γ(t)." },
        { name: "GammaNetwork",                    href: "#gamma", description: "Learnable monotone noise schedule implemented as a positive-weight MLP." },
        { name: "PositiveLinear",                  href: "#poslin", description: "Linear layer with weights constrained positive via softplus; used inside GammaNetwork." },
      ]} />

      {/* ──────────────────────────────────────────────────────────────── */}
      <div id="evd" className="mt-10">
        <ApiEntry
          name="torch_pharma.models.diffusion.EquivariantVariationalDiffusion"
          kind="class"
          signature="dynamics_network, dataset_info, num_atom_types=16, num_x_dims=3, include_charges=False, num_timesteps=1000, parametrization='eps', noise_schedule='polynomial_2', noise_precision=1e-5, loss_type='l2', norm_values=(1.0, 4.0, 10.0), norm_biases=(0.0, 0.0, 0.0), self_condition=True, diffusion_target='atom_types_and_coords'"
          description="Equivariant Variational Diffusion (EVD) model. Jointly diffuses 3D atom coordinates (x) and atom-type features (h) using a continuous-time forward process and a learned denoising backbone. The forward process is translation-invariant: coordinate noise is projected onto the zero centre-of-gravity subspace at every step."
          params={[
            { name: "dynamics_network", type: "nn.Module", description: "Denoising backbone (e.g. EGNNDynamics or GCPNetDynamics). Must accept a noisy batch and return predicted noise." },
            { name: "dataset_info", type: "dict", description: "Must contain an 'n_nodes' key with a histogram dict {num_nodes: count} used to build the node-count prior." },
            { name: "num_atom_types", type: "int", description: "Vocabulary size of the one-hot atom-type encoding.", default: "16" },
            { name: "num_x_dims", type: "int", description: "Spatial dimensionality of atom coordinates. Always 3 for molecules.", default: "3" },
            { name: "include_charges", type: "bool", description: "If True, integer atomic charge is appended to h and jointly diffused.", default: "False" },
            { name: "num_timesteps", type: "int", description: "Total diffusion steps T.", default: "1000" },
            { name: "parametrization", type: "str", description: "Noise parametrization. Only 'eps' (predicting added noise) is supported.", default: "'eps'" },
            { name: "noise_schedule", type: "str", description: "One of 'cosine', 'polynomial_2', 'polynomial_n', or 'learned'. 'learned' requires loss_type='vlb'.", default: "'polynomial_2'" },
            { name: "noise_precision", type: "float", description: "Numerical clipping floor applied to polynomial schedule values.", default: "1e-5" },
            { name: "loss_type", type: "str", description: "'l2' for simple MSE loss or 'vlb' for variational lower bound. 'vlb' is required when noise_schedule='learned'.", default: "'l2'" },
            { name: "norm_values", type: "tuple[float, ...]", description: "Per-channel scale factors applied before diffusion for [coordinates, categorical features, integer features].", default: "(1.0, 4.0, 10.0)" },
            { name: "norm_biases", type: "tuple[float, ...]", description: "Per-channel bias applied before diffusion.", default: "(0.0, 0.0, 0.0)" },
            { name: "self_condition", type: "bool", description: "Enable self-conditioning: the previous prediction is fed back as an additional input with probability 0.5 during training.", default: "True" },
            { name: "diffusion_target", type: "str", description: "Specifies which features are jointly diffused. Currently only 'atom_types_and_coords' is supported.", default: "'atom_types_and_coords'" },
          ]}
          example={`from torch_pharma.models.diffusion import EquivariantVariationalDiffusion
from torch_pharma.models.dynamics.egnn import EGNNDynamics

dynamics = EGNNDynamics(num_atom_types=5, h_hidden_dim=256, num_encoder_layers=9)

model = EquivariantVariationalDiffusion(
    dynamics_network=dynamics,
    dataset_info=dataset_info,   # must contain "n_nodes" histogram
    num_atom_types=5,
    noise_schedule="polynomial_2",
    num_timesteps=1000,
)

# Training step
loss, *_ = model(batch)
loss.backward()

# Sampling
from torch_pharma.utils.io import num_nodes_to_batch_index
num_nodes = torch.tensor([19] * 32)
samples = model.sample(num_samples=32, num_nodes=num_nodes)`}
          methods={[
            {
              name: "forward",
              signature: "batch, return_loss_info=False",
              description: "Compute the diffusion training objective. Samples a random timestep t, computes q(z_t | x), runs the denoising network, and returns the loss.",
              params: [
                { name: "batch", type: "torch_geometric.data.Batch", description: "Batched molecular graph with attributes: x (coords), h (atom types), batch (graph index), node_mask." },
                { name: "return_loss_info", type: "bool", optional: true, description: "If True, also return a dict of individual loss components.", default: "False" },
              ],
              returns: "Tuple[Tensor, ...] — (total_loss, loss_t, loss_0, loss_vlb, kl_prior)",
            },
            {
              name: "sample",
              signature: "num_samples, num_nodes, context=None, fix_noise=False",
              description: "Ancestral sampling. Runs the reverse diffusion chain from t=T to t=0 and decodes into atom coordinates and types.",
              params: [
                { name: "num_samples", type: "int", description: "Number of molecules to generate." },
                { name: "num_nodes", type: "Tensor", description: "1D long tensor of shape [num_samples] specifying how many atoms each generated molecule should have." },
                { name: "context", type: "Tensor, optional", description: "Property conditioning tensor of shape [num_samples, num_context_features].", default: "None" },
                { name: "fix_noise", type: "bool", optional: true, description: "If True, use the same noise realisation across all sampling steps for visualisation.", default: "False" },
              ],
              returns: "Tuple[Tensor, Tensor] — (x, h) atom coordinates and one-hot atom types",
            },
            {
              name: "compute_noised_representation",
              signature: "xh, batch_index, node_mask, gamma_t",
              description: "Compute z_t = α_t · xh + σ_t · ε given a pre-sampled noise level gamma_t.",
              returns: "Tuple[Tensor, Tensor] — (z_t, epsilon)",
            },
            {
              name: "compute_kl_prior",
              signature: "xh, batch_index, node_mask, num_nodes, device",
              description: "Analytical KL divergence KL[q(z₁|x) ∥ p(z₁)] between the fully-noised distribution at t=T and the unit Gaussian prior. Computed separately for coordinates and scalar features then summed.",
              returns: "Tensor — per-graph KL values, shape [batch_size]",
            },
            {
              name: "normalize",
              signature: "x, h, node_mask",
              description: "Apply norm_values and norm_biases to scale x and h before diffusion.",
              returns: "Tuple[Tensor, dict] — (x_norm, h_norm_dict)",
            },
            {
              name: "unnormalize",
              signature: "x, h_cat, h_int, node_mask",
              description: "Inverse of normalize. Recovers original-scale features from normalized form.",
              returns: "Tuple[Tensor, Tensor, Tensor] — (x, h_cat, h_int)",
            },
          ]}
        />
      </div>

      {/* ── PredefinedNoiseSchedule ── */}
      <div id="pns" className="mt-10">
        <ApiEntry
          name="torch_pharma.models.diffusion.PredefinedNoiseSchedule"
          kind="class"
          signature="noise_schedule, timesteps, precision"
          description="A non-learnable noise schedule. Precomputes a buffer of γ values from a chosen analytic curve indexed by integer timestep. At forward time performs a rounded integer lookup — O(1) and gradient-free."
          params={[
            { name: "noise_schedule", type: "str", description: "Schedule type: 'cosine', 'polynomial_2', or 'polynomial_n' where n is an integer exponent." },
            { name: "timesteps", type: "int", description: "Total number of diffusion steps T. Buffer length = T + 1." },
            { name: "precision", type: "float", description: "Minimum clamp value for polynomial schedules to avoid numerical underflow." },
          ]}
          example={`from torch_pharma.models.diffusion.noise import PredefinedNoiseSchedule

sched = PredefinedNoiseSchedule(
    noise_schedule="polynomial_2",
    timesteps=1000,
    precision=1e-5,
)
t = torch.tensor([0.5])
gamma = sched(t)  # → scalar log-SNR`}
          methods={[
            {
              name: "forward",
              signature: "t",
              description: "Look up the precomputed γ for a normalized time t ∈ [0, 1]. Converts to integer index via rounding.",
              params: [{ name: "t", type: "Tensor", description: "Normalized timestep tensor, values in [0, 1]." }],
              returns: "Tensor — γ(t), same shape as t",
            },
          ]}
        />
      </div>

      {/* ── GammaNetwork ── */}
      <div id="gamma" className="mt-10">
        <ApiEntry
          name="torch_pharma.models.diffusion.GammaNetwork"
          kind="class"
          signature=""
          description="A learnable monotone noise schedule. Implemented as a small MLP built from PositiveLinear layers, ensuring γ is strictly increasing in t. Valid only when loss_type='vlb'."
          note="GammaNetwork learns γ₀ (≈ -5) and γ₁ (≈ 10) as trainable scalar parameters. The output is renormalized so that γ(0) = γ₀ and γ(1) = γ₁ at all times."
          example={`from torch_pharma.models.diffusion.noise import GammaNetwork

sched = GammaNetwork()
t = torch.linspace(0, 1, 100)
gamma = sched(t)   # learned γ(t) curve`}
          methods={[
            {
              name: "forward",
              signature: "t",
              description: "Evaluate the learned schedule at normalized times t ∈ [0, 1].",
              params: [{ name: "t", type: "Tensor", description: "Normalized timestep tensor." }],
              returns: "Tensor — γ(t)",
            },
          ]}
        />
      </div>

      {/* ── PositiveLinear ── */}
      <div id="poslin" className="mt-10">
        <ApiEntry
          name="torch_pharma.models.diffusion.PositiveLinear"
          kind="class"
          signature="in_features, out_features, bias=True"
          description="A linear layer whose weights are constrained positive by applying softplus. Used as the building block of GammaNetwork to guarantee a monotonically increasing noise schedule."
          params={[
            { name: "in_features", type: "int", description: "Size of each input sample." },
            { name: "out_features", type: "int", description: "Size of each output sample." },
            { name: "bias", type: "bool", description: "If True, adds a learnable bias.", default: "True" },
          ]}
        />
      </div>

      {/* ── Static utility functions ── */}
      <h2 className="api-category mt-10">Functions</h2>
      <ApiTable rows={[
        { name: "sigma(gamma, target)",                   href: "#", description: "σ(γ) = √sigmoid(γ). Returns the noise std at log-SNR γ." },
        { name: "alpha(gamma, target)",                   href: "#", description: "α(γ) = √sigmoid(−γ). Returns the signal retention at log-SNR γ." },
        { name: "SNR(gamma)",                             href: "#", description: "Signal-to-noise ratio = exp(−γ) = α²/σ²." },
        { name: "sigma_and_alpha_t_given_s(γ_t, γ_s)",   href: "#", description: "Transition terms σ(t|s) and α(t|s) needed during reverse sampling." },
        { name: "gaussian_KL(q_mu_sq, q_sigma, p_sigma, d)", href: "#", description: "Closed-form KL divergence between two Gaussians in d dimensions." },
        { name: "sample_center_gravity_zero_gaussian_with_mask(...)", href: "#", description: "Sample zero-CoG Gaussian noise for equivariant coordinate perturbation." },
      ]} />
    </main>
  )
}
