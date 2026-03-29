import type { Metadata } from "next"
import { ApiEntry, ApiTable } from "@/components/api-entry"

export const metadata: Metadata = {
  title: "torch_pharma.data | Torch Pharma",
  description: "API reference for molecular datasets, loaders, and dataset utility functions",
}

export default function DataPage() {
  return (
    <main className="mx-auto max-w-3xl">
      <h1 className="mb-2 text-3xl font-bold">torch_pharma.data</h1>
      <p className="mb-8 text-sm text-muted-foreground">
        Molecular datasets, data loaders, and dataset utility functions.
      </p>

      <pre className="api-code-block mb-8"><code>{`from torch_pharma.data.datasets.qm9 import QM9Dataset
from torch_pharma.data.datasets.base import BaseDataset
from torch_pharma.data.datasets.utils import (
    get_dataset_info, download_qm9,
    process_xyz_files, process_xyz_gdb9,
    TORCH_PHARMA_HOME,
)`}</code></pre>

      <h2 className="api-category">Classes</h2>
      <ApiTable rows={[
        { name: "QM9Dataset",  href: "#qm9",  description: "The QM9 quantum chemistry benchmark. Handles downloading, splitting, parsing, and thermochemical correction." },
        { name: "BaseDataset", href: "#base", description: "Abstract base class defining the dataset interface (download / process / __getitem__ / __len__)." },
      ]} />

      <h2 className="api-category">Functions</h2>
      <ApiTable rows={[
        { name: "get_dataset_info(dataset_name, remove_h)", href: "#datasetinfo",   description: "Return the dataset_info dict for a named dataset: atom_encoder, atom_decoder, n_nodes histogram, colors_dic, radius_dic." },
        { name: "download_qm9()",                          href: "#downloadqm9",   description: "Download all GDB9 source files to TORCH_PHARMA_HOME/qm9/." },
        { name: "process_xyz_files(tar, fn, ...)",         href: "#processxyz",    description: "Extract and process XYZ files from a tar archive using a parser function." },
        { name: "process_xyz_gdb9(xyz_file)",              href: "#processgdb9",   description: "Parse a single GDB9 XYZ file into arrays: positions, charges, and properties." },
      ]} />

      {/* ── QM9Dataset ── */}
      <div id="qm9" className="mt-10">
        <ApiEntry
          name="torch_pharma.data.datasets.qm9.QM9Dataset"
          kind="class"
          signature="calculate_thermo=True"
          description="The QM9 quantum chemistry benchmark. Contains ~134k organic molecules (up to 9 heavy atoms from H, C, N, O, F) annotated with 19 electronic, energetic, and geometric properties computed by DFT. Inherits from BaseDataset."
          params={[
            { name: "calculate_thermo", type: "bool", description: "If True, subtract per-atom thermochemical energy offsets from the raw DFT targets during processing.", default: "True" },
          ]}
          example={`from torch_pharma.data.datasets.qm9 import QM9Dataset

ds = QM9Dataset(calculate_thermo=True)
ds.process()    # download → split → parse → save .npz`}
          methods={[
            {
              name: "download",
              signature: "",
              description: "Fetch dsgdb9nsd.xyz.tar.bz2, uncharacterized.txt, and atomref.txt from the GDB9 figshare into TORCH_PHARMA_HOME/qm9/.",
              returns: "None",
            },
            {
              name: "gen_splits_gdb9",
              signature: "cleanup=True",
              description: "Generate reproducible train/valid/test splits. Excludes 3,054 uncharacterized molecules. Assigns 100k to training, ~13k to test (10%), remaining to validation.",
              returns: "dict — {'train': ndarray, 'valid': ndarray, 'test': ndarray} of molecule indices",
            },
            {
              name: "get_thermo_dict",
              signature: "",
              description: "Parse atomref.txt and return per-element thermochemical energies for targets: zpve, U0, U, H, G, Cv.",
              returns: "dict[str, dict[int, float]] — {target: {atomic_charge: energy}}",
            },
            {
              name: "add_thermo_targets",
              signature: "data, therm_energy_dict",
              description: "Subtract per-atom thermochemical energies from raw DFT values and add new <target>_thermo keys to the split dict.",
              params: [
                { name: "data", type: "dict", description: "Dataset split dictionary with at least 'charges' and one target array per thermochemical target." },
                { name: "therm_energy_dict", type: "dict", description: "Output of get_thermo_dict()." },
              ],
              returns: "dict — same structure as data with additional _thermo keys",
            },
            {
              name: "get_unique_charges",
              signature: "charges",
              description: "Count the multiplicity of each atomic charge across all molecules.",
              returns: "dict[int, ndarray] — {charge: count_per_molecule}",
            },
            {
              name: "process",
              signature: "",
              description: "Full pipeline: download → gen_splits_gdb9 → process_xyz_files → optional add_thermo_targets → save compressed .npz files.",
              returns: "None",
            },
            {
              name: "compute_smiles",
              signature: "dataset, remove_h",
              description: "Iterate the training loader, build RDKit molecules via build_molecule(), and return SMILES strings via mol2smiles().",
              returns: "list[str] — SMILES strings for successfully converted training molecules",
            },
          ]}
        />
      </div>

      {/* ── BaseDataset ── */}
      <div id="base" className="mt-10">
        <ApiEntry
          name="torch_pharma.data.datasets.base.BaseDataset"
          kind="class"
          signature=""
          description="Abstract base class for all torch_pharma datasets. Subclasses must implement download() and process(). The class provides a standard lifecycle: download raw files → process to tensors → retrieve via __getitem__."
          methods={[
            { name: "download", signature: "", description: "Fetch raw data files from remote sources. Must be implemented by subclasses.", returns: "None" },
            { name: "process", signature: "", description: "Transform raw files into model-ready tensors and persist to disk. Must be implemented by subclasses.", returns: "None" },
            { name: "__getitem__", signature: "idx", description: "Return a single data sample by index. Must be implemented by subclasses.", returns: "Any" },
            { name: "__len__", signature: "", description: "Return the number of samples in the dataset.", returns: "int" },
          ]}
        />
      </div>

      {/* ── get_dataset_info ── */}
      <div id="datasetinfo" className="mt-10">
        <ApiEntry
          name="torch_pharma.data.datasets.utils.get_dataset_info"
          kind="function"
          signature="dataset_name, remove_h"
          description="Return a dataset_info dictionary used widely across the framework for encoding, decoding, visualizing, and evaluating molecules."
          params={[
            { name: "dataset_name", type: "str", description: "Name of the dataset, e.g. 'qm9' or 'qm9_second_half'." },
            { name: "remove_h", type: "bool", description: "If True, return a version of the info dict that excludes hydrogen atoms." },
          ]}
          returns={`dict with keys:
  atom_encoder  (dict[str, int])  — element symbol → one-hot index
  atom_decoder  (list[str])       — one-hot index → element symbol
  n_nodes       (dict[int, int])  — histogram {num_atoms: count} for NumNodesDistribution
  colors_dic    (dict[str, str])  — element → hex color for visualization
  radius_dic    (dict[str, float])— element → atomic radius for visualization`}
          example={`from torch_pharma.data.datasets.utils import get_dataset_info

info = get_dataset_info("qm9", remove_h=False)
print(info["atom_decoder"])  # ['H', 'C', 'N', 'O', 'F']`}
        />
      </div>

      {/* ── process_xyz_files ── */}
      <div id="processxyz" className="mt-10">
        <ApiEntry
          name="torch_pharma.data.datasets.utils.process_xyz_files"
          kind="function"
          signature="data, process_file_fn, file_idx_list=None, stack=False"
          description="Extract .xyz files from a .tar.bz2 archive and process each with a user-supplied function. Optionally filters to a specific list of file indices."
          params={[
            { name: "data", type: "str or Path", description: "Path to the .tar.bz2 archive." },
            { name: "process_file_fn", type: "callable", description: "Function applied to each extracted file. E.g. process_xyz_gdb9." },
            { name: "file_idx_list", type: "ndarray, optional", description: "Integer indices of files to extract. If None, all files are processed.", default: "None" },
            { name: "stack", type: "bool", description: "If True, stack the returned arrays along axis 0.", default: "False" },
          ]}
          returns="dict[str, ndarray] — keys are property names, values are stacked arrays"
        />
      </div>

      {/* ── process_xyz_gdb9 ── */}
      <div id="processgdb9" className="mt-10">
        <ApiEntry
          name="torch_pharma.data.datasets.utils.process_xyz_gdb9"
          kind="function"
          signature="datafile"
          description="Parse a single GDB9-format XYZ file. Reads atom symbols, positions, and all 19 molecular properties from the standard GDB9 file format."
          params={[
            { name: "datafile", type: "file-like", description: "Open file object pointing to a valid GDB9 .xyz file." },
          ]}
          returns="dict[str, ndarray] — keys: 'positions', 'charges', 'num_atoms', plus one key per molecular property (e.g. 'mu', 'alpha', 'homo', ...)"
        />
      </div>
    </main>
  )
}
