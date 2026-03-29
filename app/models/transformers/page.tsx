import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Transformers Utilities | Torch Pharma",
  description: "Distributions, gradient flow monitoring, and conditional sampling utilities",
}

export default function TransformersPage() {
  return (
    <main className="mx-auto max-w-3xl">
      <h1 className="mb-2 text-4xl font-bold">Transformers Utilities</h1>
      <p className="mb-8 text-muted-foreground">
        <code>torch_pharma.models.transformers</code> — Distributions, gradient utilities, and
        conditional sampling helpers
      </p>

      <p className="mb-6">
        This module does not implement transformer architectures in the classical sense. Instead, it
        provides <em>training orchestration utilities</em> that were historically co-located with the
        diffusion sampler: node-count distributions, property distributions, gradient flow logging, and
        conditional sampling helpers.
      </p>

      {/* --- NumNodesDistribution --- */}
      <h2 className="mb-4 mt-8 text-2xl font-semibold">
        <code>NumNodesDistribution</code>
      </h2>
      <p className="mb-4">
        A learnable-free, histogram-based prior over molecule sizes. Wraps a{" "}
        <code>torch.distributions.Categorical</code> distribution fitted from dataset node counts.
        Registered as an <code>nn.Module</code> so its buffers move with <code>.to(device)</code>.
      </p>
      <pre className="mb-4 overflow-x-auto rounded-md bg-muted p-4 text-sm">
        <code>{`histogram = {9: 3450, 17: 1200, 29: 800, ...}   # {num_nodes: count}
dist = NumNodesDistribution(histogram)
n_samples = dist.sample(n_samples=64)             # → [64] long tensor
log_p = dist.log_prob(batch_n_nodes)              # → [B] log probs`}</code>
      </pre>

      {/* --- PropertiesDistribution --- */}
      <h2 className="mb-4 mt-8 text-2xl font-semibold">
        <code>PropertiesDistribution</code>
      </h2>
      <p className="mb-4">
        An empirical distribution over molecular properties <em>conditioned on molecule size</em>. Used
        for guided generation: at sampling time, draw a context vector consistent with the target
        molecule size from this distribution.
      </p>
      <div className="mb-4 overflow-x-auto rounded-md border">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-2 text-left">Method</th>
              <th className="px-4 py-2 text-left">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            <tr>
              <td className="px-4 py-2 font-mono">__init__(dataloader, properties, device, num_bins)</td>
              <td className="px-4 py-2">
                Builds per-size, per-property binned histograms from the training dataloader
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono">set_normalizer(normalizer)</td>
              <td className="px-4 py-2">Attach mean/MAD statistics for property normalization</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono">sample(num_nodes=19)</td>
              <td className="px-4 py-2">Sample a context vector for a molecule of size num_nodes</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono">sample_batch(num_nodes)</td>
              <td className="px-4 py-2">Batched form: sample one context vector per element of num_nodes</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono">normalize_tensor(tensor, prop)</td>
              <td className="px-4 py-2">Z-score normalize a property value using stored mean/MAD</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* --- CategoricalDistribution --- */}
      <h2 className="mb-4 mt-8 text-2xl font-semibold">
        <code>CategoricalDistribution</code>
      </h2>
      <p className="mb-4">
        Wraps a fixed histogram distribution over discrete categories (e.g., atom types). Provides a KL
        divergence method to evaluate how well generated molecule distributions match the training
        distribution.
      </p>
      <pre className="mb-6 overflow-x-auto rounded-md bg-muted p-4 text-sm">
        <code>{`dist = CategoricalDistribution(histogram_dict, mapping)
kl = dist.kl_divergence(other_samples)  # list of category indices`}</code>
      </pre>

      {/* --- Queue --- */}
      <h2 className="mb-4 mt-8 text-2xl font-semibold">
        <code>Queue</code>
      </h2>
      <p className="mb-4">
        A simple fixed-length FIFO queue (backed by a Python list) used to maintain a moving window of
        recent metric values (e.g., rolling NLL estimate during training).
      </p>
      <pre className="mb-6 overflow-x-auto rounded-md bg-muted p-4 text-sm">
        <code>{`q = Queue(max_len=50)
q.add(loss.item())
print(q.mean(), q.std())`}</code>
      </pre>

      {/* --- Gradient flow --- */}
      <h2 className="mb-4 mt-8 text-2xl font-semibold">Gradient Flow Logging</h2>
      <div className="mb-6 space-y-4">
        <div className="rounded-md border p-4">
          <p className="mb-1 font-mono font-semibold">log_grad_flow_lite(named_parameters, wandb_run)</p>
          <p className="text-sm text-muted-foreground">
            Plots mean absolute gradients per non-bias layer as a line chart on WandB. Useful for
            detecting gradient vanishing.
          </p>
        </div>
        <div className="rounded-md border p-4">
          <p className="mb-1 font-mono font-semibold">log_grad_flow_full(named_parameters, wandb_run)</p>
          <p className="text-sm text-muted-foreground">
            Full version: overlays both max and mean gradient bar charts, exposing both vanishing and
            exploding gradient conditions.
          </p>
        </div>
      </div>
      <p className="mb-6">
        Both functions are no-ops when <code>wandb_run is None</code>, making them safe to call
        unconditionally.
      </p>

      {/* --- Sampling helpers --- */}
      <h2 className="mb-4 mt-8 text-2xl font-semibold">Conditional Sampling Helpers</h2>
      <div className="mb-6 space-y-4">
        <div className="rounded-md border p-4">
          <p className="mb-1 font-mono font-semibold">
            sample_sweep_conditionally(model, props_distr, num_nodes=19, num_frames=100)
          </p>
          <p className="text-sm text-muted-foreground">
            Generates <code>num_frames</code> molecules by linearly sweeping a property from its min to
            max value for a fixed molecule size. Useful for latent space visualization.
          </p>
        </div>
        <div className="rounded-md border p-4">
          <p className="mb-1 font-mono font-semibold">
            save_and_sample_conditionally(experiment_name, model, props_distr, dataset_info, epoch)
          </p>
          <p className="text-sm text-muted-foreground">
            End-to-end helper: runs a conditional property sweep, saves XYZ files to{" "}
            <code>outputs/{"<experiment>"}/.../</code>, and renders them as a chain GIF.
          </p>
        </div>
      </div>

      {/* --- Statistics --- */}
      <h2 className="mb-4 mt-8 text-2xl font-semibold">Property Statistics</h2>
      <div className="mb-6 space-y-4">
        <div className="rounded-md border p-4">
          <p className="mb-1 font-mono font-semibold">
            compute_mean_mad(dataloaders, properties, dataset_name)
          </p>
          <p className="text-sm text-muted-foreground">
            Computes per-property mean and MAD (Mean Absolute Deviation) from the training dataloader.
            Returns a nested dict:{" "}
            <code>{"{prop: {\"mean\": ..., \"mad\": ...}}"}</code>
          </p>
        </div>
        <div className="rounded-md border p-4">
          <p className="mb-1 font-mono font-semibold">inflate_batch_array(array, target)</p>
          <p className="text-sm text-muted-foreground">
            Re-exported from <code>utils.math</code>. Broadcasts a batch-level scalar array to match the
            shape of a node-level target tensor.
          </p>
        </div>
      </div>
    </main>
  )
}
