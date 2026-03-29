import type { Metadata } from "next"
import { ApiEntry, ApiTable } from "@/components/api-entry"

export const metadata: Metadata = {
  title: "torch_pharma.models.transformers | Torch Pharma",
  description: "API reference for distributions, gradient logging, and conditional sampling utilities",
}

export default function TransformersPage() {
  return (
    <main className="mx-auto max-w-3xl">
      <h1 className="mb-2 text-3xl font-bold">torch_pharma.models.transformers</h1>
      <p className="mb-8 text-sm text-muted-foreground">
        Molecule-size distributions, property distributions, gradient utilities, and conditional sampling helpers.
      </p>

      <pre className="api-code-block mb-8"><code>{`from torch_pharma.models.transformers import (
    NumNodesDistribution,
    PropertiesDistribution,
    CategoricalDistribution,
    Queue,
    compute_mean_mad,
    log_grad_flow_lite,
    log_grad_flow_full,
)`}</code></pre>

      <h2 className="api-category">Classes</h2>
      <ApiTable rows={[
        { name: "NumNodesDistribution",    href: "#nnd",   description: "Histogram prior p(N) over molecule node counts." },
        { name: "PropertiesDistribution",  href: "#pd",    description: "Per-size empirical prior over molecular property values for conditional generation." },
        { name: "CategoricalDistribution", href: "#cd",    description: "Fixed histogram over discrete categories with KL divergence measurement." },
        { name: "Queue",                   href: "#queue", description: "Fixed-length FIFO for rolling metric windows." },
      ]} />

      <h2 className="api-category">Functions</h2>
      <ApiTable rows={[
        { name: "compute_mean_mad(dataloaders, properties, dataset_name)", href: "#meanmad",   description: "Compute per-property mean and MAD (mean absolute deviation) from the training dataloader." },
        { name: "log_grad_flow_lite(named_parameters, wandb_run)",         href: "#gradlite",  description: "Plot mean absolute gradients per layer as a WandB line chart." },
        { name: "log_grad_flow_full(named_parameters, wandb_run)",         href: "#gradfull",  description: "Plot both max and mean gradient bar charts to WandB." },
        { name: "sample_sweep_conditionally(model, props_distr, ...)",     href: "#sweep",     description: "Generate molecules by sweeping a property linearly from min to max for a fixed molecule size." },
        { name: "save_and_sample_conditionally(exp_name, model, ...)",     href: "#savesample",description: "Run a conditional property sweep, save XYZ files, and render a denoising chain GIF." },
      ]} />

      {/* ── NumNodesDistribution ── */}
      <div id="nnd" className="mt-10">
        <ApiEntry
          name="torch_pharma.models.transformers.NumNodesDistribution"
          kind="class"
          signature="histogram"
          description="An nn.Module that wraps a torch.distributions.Categorical fitted to a dataset node-count histogram. Provides .sample() and .log_prob() for use in the diffusion generative process. Buffers move with .to(device)."
          params={[
            { name: "histogram", type: "dict[int, int]", description: "Mapping {num_nodes: count} from the training dataset." },
          ]}
          example={`from torch_pharma.models.transformers import NumNodesDistribution

histogram = {9: 3450, 17: 1200, 29: 800}
dist = NumNodesDistribution(histogram)

n = dist.sample(n_samples=64)       # Tensor (64,) long
lp = dist.log_prob(n)               # Tensor (64,) float`}
          methods={[
            {
              name: "sample",
              signature: "n_samples",
              description: "Sample n_samples integers from the prior distribution p(N).",
              params: [{ name: "n_samples", type: "int", description: "Number of samples to draw." }],
              returns: "Tensor — shape (n_samples,), dtype long",
            },
            {
              name: "log_prob",
              signature: "batch_n_nodes",
              description: "Evaluate log p(N) for a batch of node counts.",
              params: [{ name: "batch_n_nodes", type: "Tensor", description: "1D long tensor of node counts." }],
              returns: "Tensor — log probabilities, same shape as input",
            },
          ]}
        />
      </div>

      {/* ── PropertiesDistribution ── */}
      <div id="pd" className="mt-10">
        <ApiEntry
          name="torch_pharma.models.transformers.PropertiesDistribution"
          kind="class"
          signature="dataloader, properties, device, num_bins=1000"
          description="An empirical distribution over molecular property values conditioned on molecule size. Built from the training dataloader by binning each property into num_bins histogram bins per molecule size. Used for conditional generation: sample a context vector consistent with a target molecule size."
          params={[
            { name: "dataloader", type: "DataLoader", description: "Training dataloader used to build the histograms." },
            { name: "properties", type: "list[str]", description: "List of property keys to model (must match batch dict keys)." },
            { name: "device", type: "torch.device", description: "Device for storing the histogram tensors." },
            { name: "num_bins", type: "int", description: "Number of bins per property per molecule size.", default: "1000" },
          ]}
          methods={[
            {
              name: "set_normalizer",
              signature: "normalizer",
              description: "Attach a mean/MAD normalizer dict (e.g. from compute_mean_mad) for property normalization.",
              params: [{ name: "normalizer", type: "dict", description: "Output of compute_mean_mad()." }],
              returns: "None",
            },
            {
              name: "sample",
              signature: "num_nodes=19",
              description: "Sample a single context property vector for a molecule with num_nodes atoms.",
              params: [{ name: "num_nodes", type: "int", description: "Number of atoms.", default: "19" }],
              returns: "Tensor — context vector of shape (len(properties),)",
            },
            {
              name: "sample_batch",
              signature: "num_nodes",
              description: "Batch version of sample: draw one context vector per element of num_nodes.",
              params: [{ name: "num_nodes", type: "Tensor", description: "1D long tensor, one entry per molecule in the batch." }],
              returns: "Tensor — context matrix of shape (B, len(properties))",
            },
            {
              name: "normalize_tensor",
              signature: "tensor, prop",
              description: "Z-score normalize property values using stored mean and MAD.",
              params: [
                { name: "tensor", type: "Tensor", description: "Raw property values." },
                { name: "prop", type: "str", description: "Property name, used to look up mean/MAD in the normalizer." },
              ],
              returns: "Tensor — normalized values",
            },
          ]}
        />
      </div>

      {/* ── CategoricalDistribution ── */}
      <div id="cd" className="mt-10">
        <ApiEntry
          name="torch_pharma.models.transformers.CategoricalDistribution"
          kind="class"
          signature="histogram, mapping"
          description="A fixed discrete distribution over named categories (e.g. atom types). Primarily used to compare generated molecule type distributions against the training distribution via KL divergence."
          params={[
            { name: "histogram", type: "dict[str, int]", description: "Mapping {category_name: count} from the training dataset." },
            { name: "mapping", type: "list[str]", description: "Ordered list of all category names defining the distribution alphabet." },
          ]}
          methods={[
            {
              name: "kl_divergence",
              signature: "samples",
              description: "Estimate KL[q ∥ p] where q is the empirical distribution of samples and p is this prior.",
              params: [{ name: "samples", type: "list[str]", description: "Generated category labels." }],
              returns: "float — KL divergence value",
            },
          ]}
        />
      </div>

      {/* ── Queue ── */}
      <div id="queue" className="mt-10">
        <ApiEntry
          name="torch_pharma.models.transformers.Queue"
          kind="class"
          signature="max_len=50"
          description="Fixed-length FIFO queue backed by a Python list. Evicts the oldest entry when full. Used during training to maintain a rolling window of recent metric values."
          params={[
            { name: "max_len", type: "int", description: "Maximum number of entries before eviction.", default: "50" },
          ]}
          example={`from torch_pharma.models.transformers import Queue

q = Queue(max_len=50)
q.add(0.32)
q.add(0.28)
print(q.mean(), q.std())`}
          methods={[
            { name: "add", signature: "val", description: "Append val to the queue. Evicts the oldest item if at capacity.", returns: "None" },
            { name: "mean", signature: "", description: "Compute the mean of all current entries.", returns: "float" },
            { name: "std", signature: "", description: "Compute the standard deviation of all current entries.", returns: "float" },
          ]}
        />
      </div>

      {/* ── compute_mean_mad ── */}
      <div id="meanmad" className="mt-10">
        <ApiEntry
          name="torch_pharma.models.transformers.compute_mean_mad"
          kind="function"
          signature="dataloaders, properties, dataset_name"
          description="Compute per-property mean and Mean Absolute Deviation (MAD) from the training dataloader. Returns a nested dict suitable for passing to PropertiesDistribution.set_normalizer()."
          params={[
            { name: "dataloaders", type: "dict[str, DataLoader]", description: "Dict with at least a 'train' key." },
            { name: "properties", type: "list[str]", description: "Property keys to compute statistics for." },
            { name: "dataset_name", type: "str", description: "Dataset identifier string (used for logging)." },
          ]}
          returns="dict[str, dict[str, float]] — {prop: {'mean': ..., 'mad': ...}}"
          example={`from torch_pharma.models.transformers import compute_mean_mad

normalizer = compute_mean_mad(dataloaders, properties=["alpha", "mu"], dataset_name="qm9")`}
        />
      </div>

      {/* ── log_grad_flow_lite ── */}
      <div id="gradlite" className="mt-10">
        <ApiEntry
          name="torch_pharma.models.transformers.log_grad_flow_lite"
          kind="function"
          signature="named_parameters, wandb_run"
          description="Plot the mean absolute gradient value per non-bias layer as a line chart to WandB. Useful for detecting gradient vanishing. Is a no-op if wandb_run is None."
          params={[
            { name: "named_parameters", type: "Iterable[Tuple[str, Parameter]]", description: "model.named_parameters()." },
            { name: "wandb_run", type: "wandb.Run or None", description: "Active WandB run. Pass None to disable logging." },
          ]}
          returns="None"
        />
      </div>
    </main>
  )
}
