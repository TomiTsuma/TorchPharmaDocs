import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Data Module | Torch Pharma",
  description: "Datasets, transforms, and loaders for molecular data",
}

export default function DataPage() {
  return (
    <main className="mx-auto max-w-3xl">
      <h1 className="mb-2 text-4xl font-bold">Data</h1>
      <p className="mb-8 text-muted-foreground">
        <code>torch_pharma.data</code> — Datasets, transforms, and data loaders
      </p>

      <p className="mb-6">
        The data module provides dataset classes, data transformations, and loader utilities for
        standard molecular benchmarks. All datasets extend <code>BaseDataset</code> which defines a
        standard download/process/load lifecycle.
      </p>

      {/* --- Datasets --- */}
      <h2 className="mb-4 mt-8 text-2xl font-semibold">Datasets</h2>

      <h3 className="mb-3 mt-6 text-lg font-semibold">
        <code>QM9Dataset</code>
      </h3>
      <p className="mb-4">
        The canonical small-molecule quantum chemistry benchmark. Contains 134k organic molecules
        with up to 9 heavy atoms (H, C, N, O, F), annotated with 19 electronic, energetic, and geometric
        properties computed by DFT.
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
              <td className="px-4 py-2 font-mono">download()</td>
              <td className="px-4 py-2">
                Fetches <code>dsgdb9nsd.xyz.tar.bz2</code>, <code>uncharacterized.txt</code>, and{" "}
                <code>atomref.txt</code> from the GDB9 figshare into <code>TORCH_PHARMA_HOME/qm9/</code>
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono">gen_splits_gdb9()</td>
              <td className="px-4 py-2">
                Generates train/valid/test splits: 100k / ~18k / ~13k molecules. Excludes the 3,054
                "uncharacterized" molecules. Uses <code>np.random.seed(0)</code> for reproducibility.
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono">get_thermo_dict()</td>
              <td className="px-4 py-2">
                Parses <code>atomref.txt</code> to build per-element thermochemical energy offsets for
                targets: zpve, U0, U, H, G, Cv
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono">add_thermo_targets(data, therm_energy_dict)</td>
              <td className="px-4 py-2">
                Subtracts per-atom thermochemical energies from raw DFT values, adding new{" "}
                <code>{"<target>_thermo"}</code> keys to each split
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono">process()</td>
              <td className="px-4 py-2">
                Full pipeline: download → split → parse XYZ tar → subtract thermo → save as compressed{" "}
                <code>.npz</code> files
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono">compute_smiles(dataset, remove_h)</td>
              <td className="px-4 py-2">
                Iterates training data, builds RDKit molecules via <code>build_molecule</code>, and
                returns a list of SMILES strings
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <pre className="mb-6 overflow-x-auto rounded-md bg-muted p-4 text-sm">
        <code>{`from torch_pharma.data.datasets.qm9 import QM9Dataset

ds = QM9Dataset(calculate_thermo=True)
ds.process()    # download, split, parse, save npz`}</code>
      </pre>

      <h3 className="mb-3 mt-6 text-lg font-semibold">
        <code>BaseDataset</code>
      </h3>
      <p className="mb-4">
        Abstract base class defining the required interface for all torch_pharma datasets:
      </p>
      <pre className="mb-6 overflow-x-auto rounded-md bg-muted p-4 text-sm">
        <code>{`class BaseDataset:
    def download(self): ...    # fetch raw files
    def process(self): ...     # transform to tensors
    def __getitem__(self): ... # return a single example
    def __len__(self): ...`}</code>
      </pre>

      <h3 className="mb-3 mt-6 text-lg font-semibold">Other Datasets (Stub)</h3>
      <div className="mb-6 overflow-x-auto rounded-md border">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-2 text-left">Dataset</th>
              <th className="px-4 py-2 text-left">File</th>
              <th className="px-4 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            <tr>
              <td className="px-4 py-2">ZINC250k</td>
              <td className="px-4 py-2 font-mono">datasets/zinc.py</td>
              <td className="px-4 py-2">Stub — structure defined, implementation pending</td>
            </tr>
            <tr>
              <td className="px-4 py-2">BindingDB</td>
              <td className="px-4 py-2 font-mono">datasets/bindingdb.py</td>
              <td className="px-4 py-2">Stub — for protein-ligand binding affinity tasks</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* --- dataset utils --- */}
      <h2 className="mb-4 mt-8 text-2xl font-semibold">Dataset Utilities</h2>
      <p className="mb-4">
        <code>torch_pharma.data.datasets.utils</code> provides parsing helpers used by <code>QM9Dataset</code>:
      </p>
      <div className="mb-6 overflow-x-auto rounded-md border">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-2 text-left">Function / Constant</th>
              <th className="px-4 py-2 text-left">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            <tr>
              <td className="px-4 py-2 font-mono">TORCH_PHARMA_HOME</td>
              <td className="px-4 py-2">Root data cache directory (env-configurable)</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono">download_qm9()</td>
              <td className="px-4 py-2">Downloads GDB9 tarballs and reference files</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono">process_xyz_files(tar, fn, file_idx_list)</td>
              <td className="px-4 py-2">
                Extracts and processes individual XYZ files from a tar archive using a provided parser
                function
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono">process_xyz_gdb9(xyz_file)</td>
              <td className="px-4 py-2">
                Parses a single GDB9 XYZ file into a dict of arrays: positions, charges, properties
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono">get_dataset_info(dataset_name, remove_h)</td>
              <td className="px-4 py-2">
                Returns the <code>dataset_info</code> dict (atom_encoder, atom_decoder, n_nodes
                histogram, colors_dic, radius_dic) needed throughout the framework
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* --- transforms --- */}
      <h2 className="mb-4 mt-8 text-2xl font-semibold">Transforms</h2>
      <p className="mb-4">
        <code>torch_pharma.data.transforms</code> — Composable data augmentation and preprocessing
        transforms applied during dataset loading.
      </p>
      <div className="mb-6 overflow-x-auto rounded-md border">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-2 text-left">Module</th>
              <th className="px-4 py-2 text-left">Contents</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            <tr>
              <td className="px-4 py-2 font-mono">augmentations.py</td>
              <td className="px-4 py-2">3D rotations, noise injection, and coordinate jitter augmentations</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono">normalization.py</td>
              <td className="px-4 py-2">Property standardization (mean/std or mean/MAD) transforms</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono">smiles_to_graph.py</td>
              <td className="px-4 py-2">
                Converts SMILES strings to PyG <code>Data</code> objects using RDKit; extracts atom and
                bond features
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  )
}
