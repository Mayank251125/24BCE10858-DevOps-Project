#!/usr/bin/perl
#
# Simple Nagios Memory Check Plugin
#

use strict;
use warnings;
use Getopt::Std;

# Exit codes
my %ERRORS = ('OK'=>0,'WARNING'=>1,'CRITICAL'=>2,'UNKNOWN'=>3);

# Parse arguments
our ($opt_w, $opt_c, $opt_u, $opt_C);
getopts('w:c:uC');

if (!defined($opt_w) || !defined($opt_c)) {
    print "Usage: $0 -w <warning_pct> -c <critical_pct> [-u] [-C]\n";
    exit $ERRORS{'UNKNOWN'};
}

# Read /proc/meminfo
if (! -f "/proc/meminfo") {
    print "UNKNOWN - /proc/meminfo not found (non-Linux system?)\n";
    exit $ERRORS{'UNKNOWN'};
}

open(my $fh, "<", "/proc/meminfo") or do {
    print "UNKNOWN - Cannot open /proc/meminfo: $!\n";
    exit $ERRORS{'UNKNOWN'};
};

my ($mem_total, $mem_free, $mem_buffers, $mem_cached, $mem_available);

while (my $line = <$fh>) {
    if ($line =~ /^MemTotal:\s+(\d+)\s+kB/) {
        $mem_total = $1;
    } elsif ($line =~ /^MemFree:\s+(\d+)\s+kB/) {
        $mem_free = $1;
    } elsif ($line =~ /^Buffers:\s+(\d+)\s+kB/) {
        $mem_buffers = $1;
    } elsif ($line =~ /^Cached:\s+(\d+)\s+kB/) {
        $mem_cached = $1;
    } elsif ($line =~ /^MemAvailable:\s+(\d+)\s+kB/) {
        $mem_available = $1;
    }
}
close($fh);

if (!defined($mem_total) || $mem_total == 0) {
    print "UNKNOWN - Could not read MemTotal from /proc/meminfo\n";
    exit $ERRORS{'UNKNOWN'};
}

# Calculate memory details
$mem_free = 0 if !defined($mem_free);
$mem_buffers = 0 if !defined($mem_buffers);
$mem_cached = 0 if !defined($mem_cached);

my $used;
if (defined($mem_available)) {
    $used = $mem_total - $mem_available;
} else {
    $used = $mem_total - $mem_free - $mem_buffers - $mem_cached;
}

my $pct = int(($used / $mem_total) * 100);

my $msg = "Memory usage: ${pct}% (Used: " . int($used/1024) . " MB, Total: " . int($mem_total/1024) . " MB)";

if ($pct >= $opt_c) {
    print "CRITICAL - $msg\n";
    exit $ERRORS{'CRITICAL'};
} elsif ($pct >= $opt_w) {
    print "WARNING - $msg\n";
    exit $ERRORS{'WARNING'};
} else {
    print "OK - $msg\n";
    exit $ERRORS{'OK'};
}
