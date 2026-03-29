import type { Metadata } from "next"
import { ApiEntry, ApiTable } from "@/components/api-entry"

export const metadata: Metadata = {
  title: "torch_pharma.utils | Torch Pharma",
  description: "API reference for math, IO, and visualization utilities",
}

export default function UtilsPage() {
  return (
    <main className="mx-auto max-w-3xl">
      <h1 className="mb-2 text-3xl font-bold">torch_pharma.utils</h1>
      <p className="mb-8 text-sm text-muted-foreground">
        Mathematical helpers, molecular IO, and 3D visualization utilities.
      </p>

      {/* ─── utils.math ─── */}
      <h2 className="mt-2 text-2xl font-semibold">torch_pharma.utils.math</h2>
      <pre className="api-code-block my-4"><code>{`from torch_pharma.utils.math import (
    safe_norm, norm_no_nan, is_identity,
    inflate_batch_array, get_grad_norm,
    batch_tensor_to_list, reverse_tensor,
)`}</code></pre>

      <h3 className="api-category">Functions</h3>
      <ApiTable rows={[
        { name: "safe_norm",            href: "#safenorm",    description: "Numerically stable L2 norm: √(∑x² + ε) + ε." },
        { name: "norm_no_nan",          href: "#normnonan",   description: "GVP-style clamped norm: √max(∑x², ε)." },
        { name: "is_identity",          href: "#isidentity2", description: "Return True if a nonlinearity is None or nn.Identity." },
        { name: "inflate_batch_array",  href: "#inflate",     description: "Broadcast a [B] scalar array to match a higher-rank per-node tensor." },
        { name: "get_grad_norm",        href: "#gradnorm",    description: "Compute total gradient norm across all parameters with gradients." },
        { name: "batch_tensor_to_list", href: "#batchlist",   description: "Split a batched flat tensor into per-graph tensors." },
        { name: "reverse_tensor",       href: "#reverse",     description: "Reverse a 1D tensor (used during reverse diffusion)." },
      ]} />

      <div id="inflate" className="mt-10">
        <ApiEntry
          name="torch_pharma.utils.math.inflate_batch_array"
          kind="function"
          signature="array, target"
          description="Reshape a per-graph [batch_size] tensor to broadcast against a per-node or per-edge tensor of arbitrary rank. Appends singleton dimensions until array.ndim == target.ndim."
          params={[
            { name: "array", type: "Tensor", description: "1D tensor of shape (B,), one value per graph in the batch." },
            { name: "target", type: "Tensor", description: "Target tensor whose rank determines how many singleton dims to append." },
          ]}
          returns="Tensor — shape (B, 1, 1, ...) broadcastable against target"
          example={`from torch_pharma.utils.math import inflate_batch_array

gamma_t = torch.randn(32)            # one gamma per graph
x       = torch.randn(320, 3)        # 10 atoms * 32 graphs

alpha_t = inflate_batch_array(gamma_t, x)   # (32, 1)
z_t = alpha_t * x                            # broadcasts correctly`}
        />
      </div>

      <div id="gradnorm" className="mt-10">
        <ApiEntry
          name="torch_pharma.utils.math.get_grad_norm"
          kind="function"
          signature="parameters, norm_type=2.0"
          description="Compute the total gradient L_p norm across all parameters that have a gradient. Mirrors torch.nn.utils.clip_grad_norm_ but returns the value without clipping."
          params={[
            { name: "parameters", type: "Iterable[Parameter]", description: "Model parameters, typically model.parameters()." },
            { name: "norm_type", type: "float", description: "Exponent p for the L_p norm.", default: "2.0" },
          ]}
          returns="Tensor — scalar gradient norm"
        />
      </div>

      <div id="safenorm" className="mt-10">
        <ApiEntry
          name="torch_pharma.utils.math.safe_norm"
          kind="function"
          signature="x, dim=-1, eps=1e-8, keepdim=False, sqrt=True"
          description="Numerically stable L2 norm. Returns √(∑x² + ε) + ε when sqrt=True, preventing NaN gradients at zero vectors."
          params={[
            { name: "x", type: "Tensor", description: "Input tensor." },
            { name: "dim", type: "int", description: "Reduction dimension.", default: "-1" },
            { name: "eps", type: "float", description: "Stability constant.", default: "1e-8" },
            { name: "keepdim", type: "bool", description: "Keep reduced dimension.", default: "False" },
            { name: "sqrt", type: "bool", description: "Return L2 norm (True) or squared + eps (False).", default: "True" },
          ]}
          returns="Tensor"
        />
      </div>

      {/* ─── utils.io ─── */}
      <h2 className="mt-12 text-2xl font-semibold">torch_pharma.utils.io</h2>
      <pre className="api-code-block my-4"><code>{`from torch_pharma.utils.io import (
    save_xyz_file, write_xyz_file, write_sdf_file,
    load_molecule_xyz, load_files_with_ext,
    num_nodes_to_batch_index,
)`}</code></pre>

      <h3 className="api-category">Functions</h3>
      <ApiTable rows={[
        { name: "save_xyz_file(path, positions, one_hot, ...)",             href: "#savexyz",    description: "Write a batch of molecules to individual .xyz files, one per graph." },
        { name: "write_xyz_file(positions, atom_types, filename)",          href: "#writexyz",   description: "Write a single molecule to an XYZ file." },
        { name: "write_sdf_file(sdf_path, molecules)",                      href: "#writesdf",   description: "Write a list of RDKit Mol objects to an SDF file." },
        { name: "load_molecule_xyz(file, dataset_info)",                    href: "#loadxyz",    description: "Parse an XYZ file and return (positions, one_hot) tensors." },
        { name: "load_files_with_ext(path, ext, shuffle)",                  href: "#loadfiles",  description: "List all files in path with a given extension, optionally shuffled." },
        { name: "num_nodes_to_batch_index(num_samples, num_nodes, device)", href: "#batchidx",   description: "Construct a batch_index tensor from per-graph node counts." },
      ]} />

      <div id="savexyz" className="mt-10">
        <ApiEntry
          name="torch_pharma.utils.io.save_xyz_file"
          kind="function"
          signature="path, positions, one_hot, dataset_info, id_from=0, name='molecule', node_mask=None"
          description="Write a batched set of generated molecules to individual .xyz files. Decodes one-hot atom types using dataset_info['atom_decoder']."
          params={[
            { name: "path", type: "str or Path", description: "Output directory. Created if it does not exist." },
            { name: "positions", type: "Tensor", description: "Atom coordinates, shape (B, N_max, 3)." },
            { name: "one_hot", type: "Tensor", description: "One-hot atom types, shape (B, N_max, num_atom_types)." },
            { name: "dataset_info", type: "dict", description: "Must contain 'atom_decoder' mapping index → element symbol." },
            { name: "id_from", type: "int", description: "Starting index used in output filenames.", default: "0" },
            { name: "name", type: "str", description: "Filename prefix.", default: "'molecule'" },
            { name: "node_mask", type: "Tensor, optional", description: "Boolean mask shape (B, N_max) identifying real atoms.", default: "None" },
          ]}
          returns="None"
        />
      </div>

      <div id="batchidx" className="mt-10">
        <ApiEntry
          name="torch_pharma.utils.io.num_nodes_to_batch_index"
          kind="function"
          signature="num_samples, num_nodes, device"
          description="Construct a batch_index tensor (e.g. [0,0,0,1,1,...]) from per-graph node counts. Used to initialise sampling without a data batch."
          params={[
            { name: "num_samples", type: "int", description: "Total number of graphs in the batch." },
            { name: "num_nodes", type: "Tensor", description: "1D long tensor of shape (num_samples,), per-graph atom count." },
            { name: "device", type: "torch.device", description: "Target device for the output tensor." },
          ]}
          returns="Tensor — batch_index of shape (sum(num_nodes),)"
        />
      </div>

      {/* ─── utils.visualize ─── */}
      <h2 className="mt-12 text-2xl font-semibold">torch_pharma.utils.visualize</h2>
      <pre className="api-code-block my-4"><code>{`from torch_pharma.utils.visualize import (
    visualize_mol, visualize_mol_chain,
    plot_data3d, plot_molecule,
)`}</code></pre>

      <h3 className="api-category">Functions</h3>
      <ApiTable rows={[
        { name: "visualize_mol(path, dataset_info, max_num, ...)", href: "#vizmol",   description: "Load XYZ files from a directory and render each as a 3D matplotlib plot. Optionally logs to WandB." },
        { name: "visualize_mol_chain(path, dataset_info, ...)",   href: "#vizchain",  description: "Render a denoising trajectory as an animated GIF from sorted XYZ files." },
        { name: "plot_data3d(positions, atom_types, ...)",        href: "#plot3d",    description: "Low-level 3D scatter/sphere render of a single molecule to a file." },
        { name: "plot_molecule(ax, positions, atom_types, ...)",  href: "#plotmol",   description: "Draw atoms and bond edges onto a matplotlib 3D Axes object." },
      ]} />

      <div id="vizmol" className="mt-10">
        <ApiEntry
          name="torch_pharma.utils.visualize.visualize_mol"
          kind="function"
          signature="path, dataset_info, max_num=25, log='left', wandb_run=None"
          description="Load .xyz files from path, render each molecule as a 3D plot, and optionally upload to WandB. Reads up to max_num files."
          params={[
            { name: "path", type: "str or Path", description: "Directory containing .xyz files." },
            { name: "dataset_info", type: "dict", description: "Contains atom_decoder, colors_dic, and radius_dic." },
            { name: "max_num", type: "int", description: "Maximum number of molecules to render.", default: "25" },
            { name: "wandb_run", type: "wandb.Run, optional", description: "If provided, uploads images to this WandB run.", default: "None" },
          ]}
          returns="None"
        />
      </div>

      <div id="vizchain" className="mt-10">
        <ApiEntry
          name="torch_pharma.utils.visualize.visualize_mol_chain"
          kind="function"
          signature="path, dataset_info, wandb_run=None, spheres_3d=False, mode='chain'"
          description="Render a diffusion denoising trajectory as a GIF. Reads lexicographically sorted .xyz files from path (each file = one timestep) and concatenates into an animation using imageio."
          params={[
            { name: "path", type: "str or Path", description: "Directory of timestep .xyz files." },
            { name: "dataset_info", type: "dict", description: "Contains atom_decoder, colors_dic, and radius_dic." },
            { name: "wandb_run", type: "wandb.Run, optional", description: "If provided, uploads the GIF to WandB.", default: "None" },
            { name: "spheres_3d", type: "bool", description: "Use sphere rendering (plot_surface) instead of scatter points.", default: "False" },
          ]}
          returns="None"
        />
      </div>
    </main>
  )
}
