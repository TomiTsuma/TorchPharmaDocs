import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Diffusion Models | Torch Pharma",
  description: "Equivariant Variational Diffusion and noise schedules for 3D molecule generation",
}

export default function DiffusionPage() {
  return (
    <main className="mx-auto max-w-3xl">
      <h1 className="mb-2 text-4xl font-bold">Diffusion Models</h1>
      <p className="mb-8 text-muted-foreground">
        <code>torch_pharma.models.diffusion</code>
      </p>

      <p className="mb-6">
        This module implements <strong>Equivariant Variational Diffusion (EVD)</strong> for de-novo 3D molecule
        generation. It is a continuous-time diffusion model that operates jointly over atom coordinates{" "}
        <em>x</em> (geometric) and atom-type one-hot features <em>h</em> (categorical/integer),
        preserving E(3) equivariance throughout the diffusion and denoising process.
      </p>

      <h2 className="mb-4 mt-8 text-2xl font-semibold">Architecture Overview</h2>
      <pre className="mb-6 overflow-x-auto rounded-md bg-muted p-4 text-sm">
        <code>{`EquivariantVariationalDiffusion
  ├── dynamics_network      # injected nn.Module (e.g., EGNNDynamics / GCPNetDynamics)
  ├── NumNodesDistribution  # prior p(N) from dataset histogram
  └── noise schedule        # GammaNetwork (learned) | PredefinedNoiseSchedule (fixed)`}</code>
      </pre>

      <h2 className="mb-4 mt-8 text-2xl font-semibold">
        <code>EquivariantVariationalDiffusion</code>
      </h2>
      <p className="mb-4">
        The main generative model. Initialized with a <em>dynamics network</em> that acts as the denoising
        backbone; all other hyperparameters control the noise schedule and normalization.
      </p>

      <h3 className="mb-3 mt-6 text-lg font-semibold">Constructor</h3>
      <div className="mb-6 overflow-x-auto rounded-md border">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-2 text-left">Parameter</th>
              <th className="px-4 py-2 text-left">Type</th>
              <th className="px-4 py-2 text-left">Default</th>
              <th className="px-4 py-2 text-left">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            <tr>
              <td className="px-4 py-2 font-mono">dynamics_network</td>
              <td className="px-4 py-2">nn.Module</td>
              <td className="px-4 py-2">—</td>
              <td className="px-4 py-2">Denoising backbone (EGNNDynamics or GCPNetDynamics)</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono">dataset_info</td>
              <td className="px-4 py-2">Dict</td>
              <td className="px-4 py-2">—</td>
              <td className="px-4 py-2">Must contain <code>n_nodes</code> histogram for the node-count prior</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono">num_atom_types</td>
              <td className="px-4 py-2">int</td>
              <td className="px-4 py-2">16</td>
              <td className="px-4 py-2">Size of the one-hot atom-type vocabulary</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono">num_x_dims</td>
              <td className="px-4 py-2">int</td>
              <td className="px-4 py-2">3</td>
              <td className="px-4 py-2">Spatial dimensionality (always 3 for molecules)</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono">include_charges</td>
              <td className="px-4 py-2">bool</td>
              <td className="px-4 py-2">False</td>
              <td className="px-4 py-2">Whether to diffuse integer charge features alongside atom types</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono">num_timesteps</td>
              <td className="px-4 py-2">int</td>
              <td className="px-4 py-2">1000</td>
              <td className="px-4 py-2">Total diffusion steps T</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono">parametrization</td>
              <td className="px-4 py-2">str</td>
              <td className="px-4 py-2">"eps"</td>
              <td className="px-4 py-2">Only <code>"eps"</code> (noise prediction) is currently supported</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono">noise_schedule</td>
              <td className="px-4 py-2">str</td>
              <td className="px-4 py-2">"polynomial_2"</td>
              <td className="px-4 py-2"><code>cosine</code> | <code>polynomial_n</code> | <code>polynomial_2</code> | <code>learned</code></td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono">noise_precision</td>
              <td className="px-4 py-2">float</td>
              <td className="px-4 py-2">1e-5</td>
              <td className="px-4 py-2">Clipping floor for polynomial schedules</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono">loss_type</td>
              <td className="px-4 py-2">str</td>
              <td className="px-4 py-2">"l2"</td>
              <td className="px-4 py-2"><code>"l2"</code> or <code>"vlb"</code> (required for learned schedule)</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono">norm_values</td>
              <td className="px-4 py-2">List[float]</td>
              <td className="px-4 py-2">[1.0, 4.0, 10.0]</td>
              <td className="px-4 py-2">Scale factors for [coords, categorical, integer] features</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono">self_condition</td>
              <td className="px-4 py-2">bool</td>
              <td className="px-4 py-2">True</td>
              <td className="px-4 py-2">Use self-conditioning to improve sample quality</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono">diffusion_target</td>
              <td className="px-4 py-2">str</td>
              <td className="px-4 py-2">"atom_types_and_coords"</td>
              <td className="px-4 py-2">What features to jointly diffuse; only this target is currently supported</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 className="mb-3 mt-6 text-lg font-semibold">Key Methods</h3>
      <div className="mb-6 space-y-4">
        <div className="rounded-md border p-4">
          <p className="mb-1 font-mono font-semibold">forward(batch, return_loss_info=False)</p>
          <p className="text-sm text-muted-foreground">
            Computes the diffusion training objective. Internally dispatches to{" "}
            <code>atom_types_and_coords_forward()</code>. Returns a tuple of loss tensors including the
            negative ELBO decomposed into L2/VLB terms, KL prior, and log p(N).
          </p>
        </div>
        <div className="rounded-md border p-4">
          <p className="mb-1 font-mono font-semibold">
            sample(num_samples, num_nodes, context=None, fix_noise=False)
          </p>
          <p className="text-sm text-muted-foreground">
            Ancestral sampling from the trained model. Iterates from t=T to t=0, computing{" "}
            <code>p(z_s | z_t)</code> at each step and decoding into atom coordinates and types.
          </p>
        </div>
        <div className="rounded-md border p-4">
          <p className="mb-1 font-mono font-semibold">
            compute_noised_representation(xh, batch_index, node_mask, gamma_t)
          </p>
          <p className="text-sm text-muted-foreground">
            Computes z_t = α_t · xh + σ_t · ε for a given noise level gamma_t. Returns the noised
            tensor and the sampled noise ε.
          </p>
        </div>
        <div className="rounded-md border p-4">
          <p className="mb-1 font-mono font-semibold">compute_kl_prior(xh, batch_index, node_mask, num_nodes, device)</p>
          <p className="text-sm text-muted-foreground">
            Analytical KL divergence KL[q(z₁|x) ∥ p(z₁)] between the forward process at T=1 and
            the unit Gaussian prior. Computed separately for geometric (x) and scalar (h) parts.
          </p>
        </div>
      </div>

      <h3 className="mb-3 mt-6 text-lg font-semibold">Static Utility Methods</h3>
      <div className="mb-6 overflow-x-auto rounded-md border">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-2 text-left">Method</th>
              <th className="px-4 py-2 text-left">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            <tr>
              <td className="px-4 py-2 font-mono">sigma(gamma, target)</td>
              <td className="px-4 py-2">σ = √sigmoid(γ)</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono">alpha(gamma, target)</td>
              <td className="px-4 py-2">α = √sigmoid(-γ)</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono">SNR(gamma)</td>
              <td className="px-4 py-2">Signal-to-noise ratio = exp(-γ) = α²/σ²</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono">sigma_and_alpha_t_given_s(γ_t, γ_s, target)</td>
              <td className="px-4 py-2">Transition terms σ(t|s) and α(t|s) used during reverse sampling</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono">gaussian_KL(q_mu_sq, q_sigma, p_sigma, d)</td>
              <td className="px-4 py-2">Analytical Gaussian KL divergence in d dimensions</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono">sample_center_gravity_zero_gaussian_with_mask(...)</td>
              <td className="px-4 py-2">
                Samples CoG-zero Gaussian noise for coordinates (translation-invariant projection)
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="mb-4 mt-10 text-2xl font-semibold">Noise Schedules</h2>
      <p className="mb-4">
        Noise schedules are defined in <code>torch_pharma.models.diffusion.noise</code> and map a normalized
        time <em>t ∈ [0, 1]</em> to a log-SNR value γ(t).
      </p>

      <h3 className="mb-3 mt-6 text-lg font-semibold">
        <code>PredefinedNoiseSchedule</code>
      </h3>
      <p className="mb-4">
        Non-learnable schedule. Precomputes all γ values from a chosen analytic curve and stores them as a
        frozen buffer. At forward time it performs integer rounding for fast lookup.
      </p>
      <div className="mb-6 overflow-x-auto rounded-md border">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-2 text-left">Schedule</th>
              <th className="px-4 py-2 text-left">Function</th>
              <th className="px-4 py-2 text-left">When to Use</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            <tr>
              <td className="px-4 py-2 font-mono">cosine</td>
              <td className="px-4 py-2">cos²-based ᾱ schedule (Nichol & Dhariwal 2021)</td>
              <td className="px-4 py-2">General-purpose, avoids very fast noise near t=0</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono">polynomial_2</td>
              <td className="px-4 py-2">1 - (t/T)² clipped schedule</td>
              <td className="px-4 py-2">Default; strong performance on QM9</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono">polynomial_n</td>
              <td className="px-4 py-2">1 - (t/T)^n, power specified in the schedule name string</td>
              <td className="px-4 py-2">Experimental schedules with custom polynomial power</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 className="mb-3 mt-6 text-lg font-semibold">
        <code>GammaNetwork</code>
      </h3>
      <p className="mb-4">
        A learned noise schedule implemented as a monotone MLP using <code>PositiveLinear</code> layers.
        The network is parameterized as:
      </p>
      <pre className="mb-6 overflow-x-auto rounded-md bg-muted p-4 text-sm">
        <code>{`γ̃(t) = l1(t) + l3(sigmoid(l2(l1(t))))
γ(t) = γ₀ + (γ₁ - γ₀) * (γ̃(t) - γ̃(0)) / (γ̃(1) - γ̃(0))`}</code>
      </pre>
      <p className="mb-4">
        Boundaries γ₀ (≈ -5) and γ₁ (≈ 10) are learnable parameters. Only valid when{" "}
        <code>loss_type="vlb"</code>.
      </p>

      <h3 className="mb-3 mt-6 text-lg font-semibold">
        <code>PositiveLinear</code>
      </h3>
      <p className="mb-4">
        A linear layer whose weights are guaranteed positive via <code>softplus</code>. This is the
        building block that makes <code>GammaNetwork</code> monotonically increasing.
      </p>

      <h2 className="mb-4 mt-10 text-2xl font-semibold">Usage Example</h2>
      <pre className="mb-6 overflow-x-auto rounded-md bg-muted p-4 text-sm">
        <code>{`from torch_pharma.models.diffusion import EquivariantVariationalDiffusion
from torch_pharma.models.dynamics.egnn import EGNNDynamics

# 1. Build the denoising backbone
dynamics = EGNNDynamics(
    num_atom_types=16,
    num_encoder_layers=9,
    h_hidden_dim=256,
)

# 2. Wrap in EVD
model = EquivariantVariationalDiffusion(
    dynamics_network=dynamics,
    dataset_info=dataset_info,   # must contain "n_nodes" histogram
    num_atom_types=16,
    noise_schedule="polynomial_2",
    num_timesteps=1000,
    loss_type="l2",
    self_condition=True,
)

# 3. Training step
loss, *loss_terms = model(batch)
loss.backward()

# 4. Sampling
x, h = model.sample(num_samples=64, num_nodes=torch.tensor([19]*64))`}</code>
      </pre>

      <h2 className="mb-4 mt-10 text-2xl font-semibold">Design Notes</h2>
      <ul className="mb-6 list-inside list-disc space-y-2 text-muted-foreground">
        <li>
          <strong>Constructor injection:</strong> The dynamics network is passed as an argument, not
          instantiated inside the diffusion model. This cleanly separates generative process logic from
          architecture choices.
        </li>
        <li>
          <strong>Translation invariance:</strong>{" "}
          <code>sample_center_gravity_zero_gaussian_with_mask</code> ensures coordinate noise lives in the
          zero-CoG subspace, making generation equivariant.
        </li>
        <li>
          <strong>Self-conditioning:</strong> When enabled, the model receives its own previous
          prediction xh_self_cond as additional input during the forward pass (with probability 0.5 during
          training).
        </li>
        <li>
          <strong>Normalization:</strong> <code>norm_values</code> and <code>norm_biases</code> scale
          features before diffusion; a built-in check <code>detect_issues_with_norm_values</code>{" "}
          validates that the normalization is not too aggressive relative to σ₀.
        </li>
      </ul>
    </main>
  )
}
