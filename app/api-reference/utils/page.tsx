import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Utils Module | Torch Pharma",
  description: "Mathematical, IO, visualization, and seed utilities",
}

export default function UtilsPage() {
  return (
    <main className="mx-auto max-w-3xl">
      <h1 className="mb-2 text-4xl font-bold">Utils</h1>
      <p className="mb-8 text-muted-foreground">
        <code>torch_pharma.utils</code> — Cross-cutting utility functions
      </p>

      <p className="mb-6">
        The utils package provides standalone helper functions grouped by concern: mathematics, IO,
        visualization, seeding, and vector operations. All functions are decorated with{" "}
        <code>@typechecked</code> via <code>torchtyping</code>, giving informative error messages on shape
        mismatches.
      </p>

      {/* ── utils.math ── */}
      <h2 className="mb-4 mt-8 text-2xl font-semibold">
        <code>utils.math</code>
      </h2>
      <div className="mb-6 overflow-x-auto rounded-md border">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-2 text-left">Function</th>
              <th className="px-4 py-2 text-left">Signature</th>
              <th className="px-4 py-2 text-left">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            <tr>
              <td className="px-4 py-2 font-mono">safe_norm</td>
              <td className="px-4 py-2 font-mono text-xs">
                (x, dim=-1, eps=1e-8, keepdim=False, sqrt=True) → Tensor
              </td>
              <td className="px-4 py-2">
                L2 norm with eps stabilization. Returns <code>sqrt(sum(x²) + eps) + eps</code> when{" "}
                <code>sqrt=True</code>.
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono">norm_no_nan</td>
              <td className="px-4 py-2 font-mono text-xs">
                (x, dim=-1, keepdim=False, eps=1e-8, sqrt=True) → Tensor
              </td>
              <td className="px-4 py-2">
                GVP-style clamped L2 norm. Uses <code>torch.clamp(sum(x²), min=eps)</code> for clean
                gradient behavior at zero.
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono">is_identity</td>
              <td className="px-4 py-2 font-mono text-xs">(nonlinearity) → bool</td>
              <td className="px-4 py-2">
                Returns True if the nonlinearity is None or an <code>nn.Identity</code> instance.
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono">inflate_batch_array</td>
              <td className="px-4 py-2 font-mono text-xs">(array, target) → Tensor</td>
              <td className="px-4 py-2">
                Reshape a <code>[batch_size]</code> array to broadcast against a target of arbitrary rank
                by appending singleton dims. Critical for applying per-graph noise levels to per-node tensors.
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono">get_grad_norm</td>
              <td className="px-4 py-2 font-mono text-xs">(parameters, norm_type=2.0) → Tensor</td>
              <td className="px-4 py-2">
                Computes the total gradient norm across all parameters with gradients. Useful for
                monitoring gradient health without clipping.
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono">batch_tensor_to_list</td>
              <td className="px-4 py-2 font-mono text-xs">(data, batch_index) → Tuple[Tensor, ...]</td>
              <td className="px-4 py-2">
                Splits a batched flat tensor along graph boundaries using <code>torch.split</code>.
                Assumes <code>batch_index</code> is sorted.
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono">reverse_tensor</td>
              <td className="px-4 py-2 font-mono text-xs">(x) → Tensor</td>
              <td className="px-4 py-2">
                Reverses a 1D tensor. Used during reverse diffusion to iterate timesteps from T to 0.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ── utils.io ── */}
      <h2 className="mb-4 mt-8 text-2xl font-semibold">
        <code>utils.io</code>
      </h2>
      <div className="mb-6 overflow-x-auto rounded-md border">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-2 text-left">Function</th>
              <th className="px-4 py-2 text-left">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            <tr>
              <td className="px-4 py-2 font-mono">save_xyz_file(path, positions, one_hot, ...)</td>
              <td className="px-4 py-2">
                Writes batched 3D molecules to individual <code>.xyz</code> files (one per graph). Decodes
                one-hot atom types using <code>dataset_info["atom_decoder"]</code>.
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono">write_xyz_file(positions, atom_types, filename)</td>
              <td className="px-4 py-2">Writes a single molecule to an XYZ file with integer atom type labels.</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono">write_sdf_file(sdf_path, molecules)</td>
              <td className="px-4 py-2">
                Writes a list of RDKit <code>Chem.Mol</code> objects to an SDF file using{" "}
                <code>SDWriter</code>. Skips None entries.
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono">load_molecule_xyz(file, dataset_info)</td>
              <td className="px-4 py-2">
                Parses an XYZ file and returns <code>(positions, one_hot)</code> tensors using the dataset
                atom encoder mapping.
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono">load_files_with_ext(path, ext, shuffle=True)</td>
              <td className="px-4 py-2">
                Glob-based file listing with optional random shuffle. Returns a list of absolute paths.
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono">num_nodes_to_batch_index(num_samples, num_nodes, device)</td>
              <td className="px-4 py-2">
                Constructs the <code>batch_index</code> tensor (e.g., <code>[0,0,0,1,1,...]</code>) from
                per-graph node counts. Used to initialize sampling without a data batch.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ── utils.visualize ── */}
      <h2 className="mb-4 mt-8 text-2xl font-semibold">
        <code>utils.visualize</code>
      </h2>
      <p className="mb-4">
        Matplotlib-based 3D molecular visualization and GIF generation, with optional WandB logging.
      </p>
      <div className="mb-6 overflow-x-auto rounded-md border">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-2 text-left">Function</th>
              <th className="px-4 py-2 text-left">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            <tr>
              <td className="px-4 py-2 font-mono">visualize_mol(path, dataset_info, ...)</td>
              <td className="px-4 py-2">
                Load XYZ files from a directory and render each molecule as a 3D scatter/sphere plot.
                Optionally log images to WandB.
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono">visualize_mol_chain(path, dataset_info, ...)</td>
              <td className="px-4 py-2">
                Render a denoising trajectory as an animated GIF by reading sorted XYZ files and
                assembling them with <code>imageio.mimsave</code>.
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono">plot_data3d(positions, atom_types, ...)</td>
              <td className="px-4 py-2">
                Low-level 3D matplotlib render of a single molecule. Supports a sphere rendering mode
                via <code>draw_sphere</code> and automatic post-brightening via imageio.
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono">plot_molecule(ax, positions, atom_types, ...)</td>
              <td className="px-4 py-2">
                Draws atoms (as scatter or spheres) and bond edges (using <code>get_bond_order</code>
                distance thresholds) onto a matplotlib 3D Axes object.
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono">draw_sphere(ax, x, y, z, size, color, alpha)</td>
              <td className="px-4 py-2">
                Renders a 3D sphere using <code>ax.plot_surface</code> with parametric angles. Used when{" "}
                <code>spheres_3d=True</code>.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="mb-6 rounded-md border border-blue-300 bg-blue-50 p-4 text-sm dark:border-blue-700 dark:bg-blue-950">
        <strong>Note:</strong> <code>visualize.py</code> currently imports from the legacy{" "}
        <code>src.utils.pylogger</code> and <code>src.datamodules.components.edm</code> paths. These
        should be updated to <code>torch_pharma.utils.logging</code> and the refactored EDM dataset module
        in a future release.
      </div>

      {/* ── modules.activation ── */}
      <h2 className="mb-4 mt-8 text-2xl font-semibold">
        <code>modules.activation</code>
      </h2>
      <p className="mb-4">
        Centralizes activation function instantiation. Exported through{" "}
        <code>torch_pharma.features</code> as <code>get_nonlinearity</code>.
      </p>
      <pre className="mb-4 overflow-x-auto rounded-md bg-muted p-4 text-sm">
        <code>{`# Module-like instance
act = get_nonlinearity("silu")              # → nn.SiLU()
act = get_nonlinearity("leakyrelu", slope=0.01)  # → nn.LeakyReLU(0.01)
act = get_nonlinearity(None)               # → nn.Identity()

# Functional
fn = get_nonlinearity("relu", return_functional=True)  # → F.relu`}</code>
      </pre>
      <div className="mb-6 overflow-x-auto rounded-md border">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-2 text-left">Name string</th>
              <th className="px-4 py-2 text-left">Returns</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {[
              ["null / None", "nn.Identity()"],
              ["relu", "nn.ReLU()"],
              ["leakyrelu", "nn.LeakyReLU(slope)"],
              ["selu", "nn.SELU()"],
              ["silu / swish", "nn.SiLU() (with Swish_ fallback for old PyTorch)"],
              ["sigmoid", "nn.Sigmoid()"],
              ["tanh", "nn.Tanh()"],
            ].map(([name, ret]) => (
              <tr key={name}>
                <td className="px-4 py-2 font-mono">{name}</td>
                <td className="px-4 py-2 font-mono text-xs">{ret}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mb-4">
        <code>SiLU</code> is also exported directly as a class alias that falls back to the{" "}
        <code>Swish_</code> implementation (x·sigmoid(x)) on PyTorch versions without{" "}
        <code>nn.SiLU</code>.
      </p>
    </main>
  )
}
