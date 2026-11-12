import { CodeSample } from '../types';

export const CODE_SAMPLES: CodeSample[] = [
  {
    id: 'matrix-mult',
    title: 'Matrix Multiplication (128x128)',
    category: 'Linear Algebra / Memory Tiling',
    description: 'Triple-nested matrix product. Tests auto-vectorization, loop interchange, and memory hierarchy register allocation.',
    language: 'c',
    targetOptimization: 'loop-vectorize, loop-unroll, licm',
    code: `#include <stdio.h>
#include <stdlib.h>

#define N 128

void matrix_multiply(double A[N][N], double B[N][N], double C[N][N]) {
    for (int i = 0; i < N; i++) {
        for (int k = 0; k < N; k++) {
            double r = A[i][k];
            for (int j = 0; j < N; j++) {
                C[i][j] += r * B[k][j];
            }
        }
    }
}

int main() {
    static double A[N][N];
    static double B[N][N];
    static double C[N][N];

    for (int i = 0; i < N; i++) {
        for (int j = 0; j < N; j++) {
            A[i][j] = (double)((i + j) % 17) * 0.125;
            B[i][j] = (double)((i * 3 + j) % 19) * 0.25;
            C[i][j] = 0.0;
        }
    }

    // Run multi-pass multiplication
    for (int step = 0; step < 12; step++) {
        matrix_multiply(A, B, C);
    }

    double checksum = 0.0;
    for (int i = 0; i < N; i++) {
        checksum += C[i][i];
    }

    printf("RESULT_CHECKSUM: %.4f\\n", checksum);
    return 0;
}`,
  },
  {
    id: 'n-body',
    title: 'N-Body Particle Interaction',
    category: 'Scientific Computing / Physics',
    description: 'Simulates gravitational attraction between particles. Heavy floating-point arithmetic with square root computations.',
    language: 'c',
    targetOptimization: 'instcombine, loop-unroll, early-cse, slp-vectorizer',
    code: `#include <stdio.h>
#include <math.h>

#define BODIES 64
#define STEPS 1500
#define DT 0.01

typedef struct {
    double x, y, z;
    double vx, vy, vz;
    double mass;
} Body;

int main() {
    Body bodies[BODIES];
    for (int i = 0; i < BODIES; i++) {
        bodies[i].x = (double)(i % 7) * 1.5;
        bodies[i].y = (double)(i % 5) * -2.0;
        bodies[i].z = (double)(i % 3) * 0.5;
        bodies[i].vx = 0.0;
        bodies[i].vy = 0.0;
        bodies[i].vz = 0.0;
        bodies[i].mass = 1.0 + (double)(i % 4) * 0.5;
    }

    for (int step = 0; step < STEPS; step++) {
        for (int i = 0; i < BODIES; i++) {
            double fx = 0.0, fy = 0.0, fz = 0.0;
            for (int j = 0; j < BODIES; j++) {
                if (i == j) continue;
                double dx = bodies[j].x - bodies[i].x;
                double dy = bodies[j].y - bodies[i].y;
                double dz = bodies[j].z - bodies[i].z;
                double dist_sq = dx*dx + dy*dy + dz*dz + 0.001;
                double inv_dist = 1.0 / sqrt(dist_sq);
                double f = bodies[j].mass * inv_dist * inv_dist * inv_dist;
                fx += f * dx;
                fy += f * dy;
                fz += f * dz;
            }
            bodies[i].vx += fx * DT;
            bodies[i].vy += fy * DT;
            bodies[i].vz += fz * DT;
        }

        for (int i = 0; i < BODIES; i++) {
            bodies[i].x += bodies[i].vx * DT;
            bodies[i].y += bodies[i].vy * DT;
            bodies[i].z += bodies[i].vz * DT;
        }
    }

    double total_energy = 0.0;
    for (int i = 0; i < BODIES; i++) {
        total_energy += bodies[i].vx * bodies[i].vx + bodies[i].x;
    }

    printf("RESULT_NBODY: %.5f\\n", total_energy);
    return 0;
}`,
  },
  {
    id: 'sieve-primes',
    title: 'Sieve of Eratosthenes (1M)',
    category: 'Number Theory / Bit Arrays',
    description: 'Finds prime numbers up to 1,000,000 using sequential sieve. Tests stride-access patterns, loop termination, and branch reduction.',
    language: 'c',
    targetOptimization: 'loop-rotate, licm, indvars, simplifycfg',
    code: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define LIMIT 800000

int main() {
    char *isPrime = (char*)malloc(LIMIT + 1);
    memset(isPrime, 1, LIMIT + 1);
    isPrime[0] = 0;
    isPrime[1] = 0;

    int prime_count = 0;
    long long prime_sum = 0;

    for (int p = 2; p * p <= LIMIT; p++) {
        if (isPrime[p]) {
            for (int i = p * p; i <= LIMIT; i += p) {
                isPrime[i] = 0;
            }
        }
    }

    for (int p = 2; p <= LIMIT; p++) {
        if (isPrime[p]) {
            prime_count++;
            prime_sum += p;
        }
    }

    free(isPrime);
    printf("PRIMES_FOUND: %d, SUM: %lld\\n", prime_count, prime_sum);
    return 0;
}`,
  },
  {
    id: 'fast-fourier',
    title: 'Radix-2 FFT Butterfly Operations',
    category: 'Signal Processing / Math',
    description: 'Computes Discrete Fourier Transform via bit-reversal and complex butterflies. Tests common subexpression elimination and trig factoring.',
    language: 'c',
    targetOptimization: 'gvn, reassociate, instcombine, loop-unroll',
    code: `#include <stdio.h>
#include <math.h>

#define PI 3.14159265358979323846
#define N 2048

void fft(double *real, double *imag, int n) {
    int j = 0;
    for (int i = 0; i < n - 1; i++) {
        if (i < j) {
            double tr = real[i]; real[i] = real[j]; real[j] = tr;
            double ti = imag[i]; imag[i] = imag[j]; imag[j] = ti;
        }
        int k = n / 2;
        while (k <= j) {
            j -= k;
            k /= 2;
        }
        j += k;
    }

    for (int len = 2; len <= n; len <<= 1) {
        double angle = -2.0 * PI / len;
        double wlen_r = cos(angle);
        double wlen_i = sin(angle);
        for (int i = 0; i < n; i += len) {
            double w_r = 1.0, w_i = 0.0;
            for (int k = 0; k < len / 2; k++) {
                double u_r = real[i + k];
                double u_i = imag[i + k];
                double v_r = real[i + k + len/2] * w_r - imag[i + k + len/2] * w_i;
                double v_i = real[i + k + len/2] * w_i + imag[i + k + len/2] * w_r;
                real[i + k] = u_r + v_r;
                imag[i + k] = u_i + v_i;
                real[i + k + len/2] = u_r - v_r;
                imag[i + k + len/2] = u_i - v_i;
                double next_wr = w_r * wlen_r - w_i * wlen_i;
                w_i = w_r * wlen_i + w_i * wlen_r;
                w_r = next_wr;
            }
        }
    }
}

int main() {
    double real[N];
    double imag[N];

    for (int i = 0; i < N; i++) {
        real[i] = sin(2.0 * PI * i / 32.0) + 0.5 * cos(2.0 * PI * i / 64.0);
        imag[i] = 0.0;
    }

    for (int iter = 0; iter < 40; iter++) {
        fft(real, imag, N);
    }

    double energy = 0.0;
    for (int i = 0; i < N; i++) {
        energy += real[i] * real[i] + imag[i] * imag[i];
    }

    printf("FFT_ENERGY: %.4f\\n", energy);
    return 0;
}`,
  },
  {
    id: 'quicksort-partition',
    title: 'Quicksort & In-Place Partitioning',
    category: 'Algorithms / Recursion',
    description: 'Sorts large pseudo-random arrays. Tests recursive call tail optimization, branch predictability, and register spills.',
    language: 'c',
    targetOptimization: 'tailcallelim, inline, jump-threading, sroa',
    code: `#include <stdio.h>
#include <stdlib.h>

#define SIZE 40000

void swap(int *a, int *b) {
    int t = *a;
    *a = *b;
    *b = t;
}

int partition(int arr[], int low, int high) {
    int pivot = arr[high];
    int i = (low - 1);
    for (int j = low; j <= high - 1; j++) {
        if (arr[j] < pivot) {
            i++;
            swap(&arr[i], &arr[j]);
        }
    }
    swap(&arr[i + 1], &arr[high]);
    return (i + 1);
}

void quicksort(int arr[], int low, int high) {
    while (low < high) {
        int pi = partition(arr, low, high);
        if (pi - low < high - pi) {
            quicksort(arr, low, pi - 1);
            low = pi + 1;
        } else {
            quicksort(arr, pi + 1, high);
            high = pi - 1;
        }
    }
}

int main() {
    int *arr = (int*)malloc(SIZE * sizeof(int));
    unsigned int seed = 1337;

    for (int i = 0; i < SIZE; i++) {
        seed = (seed * 1103515245 + 12345) & 0x7fffffff;
        arr[i] = (int)(seed % 100000);
    }

    quicksort(arr, 0, SIZE - 1);

    long long checksum = 0;
    for (int i = 0; i < SIZE; i += 100) {
        checksum += arr[i];
    }

    free(arr);
    printf("QSORT_CHECKSUM: %lld\\n", checksum);
    return 0;
}`,
  },
  {
    id: 'dead-code-folding',
    title: 'Dead Code & Constant Folding Stress',
    category: 'Compiler Analysis / DCE',
    description: 'Designed to challenge Dead Code Elimination and Constant Folding passes. Contains heavy dead control paths and algebraic identities.',
    language: 'c',
    targetOptimization: 'dce, adce, sccp, constmerge, simplifycfg',
    code: `#include <stdio.h>

int compute_heavy(int val) {
    // Dead loops and redundant math
    int dead_sum = 0;
    for (int i = 0; i < 10000; i++) {
        dead_sum += i * 3 - (i * 2 + i); // Always 0
    }

    int result = val;
    for (int step = 0; step < 200000; step++) {
        // Redundant operations that simplify to bit shifts or constants
        int temp = result * 8;
        temp = temp / 8;
        result = temp + (step % 2) - (step % 2);
        
        // Dead branches
        if (result < 0 && result > 1000000) {
            result *= 999;
        }
    }

    return result + (dead_sum & 0);
}

int main() {
    int total = 0;
    for (int k = 1; k <= 50; k++) {
        total += compute_heavy(k);
    }
    printf("DCE_FOLDING_RESULT: %d\\n", total);
    return 0;
}`,
  },
];
